import { useMemo, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Contract } from 'ethers';
import { formatUnits, parseUnits } from 'viem';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { Header } from './Header';
import { DISTRIBUTOR_ADDRESS, DISTRIBUTOR_ABI, CONFIDENTIAL_ETH_ABI, CONFIDENTIAL_ETH_ADDRESS } from '../config/contracts';
import '../styles/DistributorApp.css';

type Row = { address: string; amount: string };

const TOKEN_DECIMALS = 6;
const MAX_UINT64 = (1n << 64n) - 1n;
const MAX_DISPLAY_AMOUNT = formatUnits(MAX_UINT64, TOKEN_DECIMALS);

function sanitizeAmountInput(value: string): string {
  if (!value) return '';
  let cleaned = '';
  let dotSeen = false;
  for (const char of value) {
    if (char >= '0' && char <= '9') {
      cleaned += char;
    } else if (char === '.' && !dotSeen) {
      dotSeen = true;
      cleaned += '.';
    }
  }
  if (!cleaned) return '';
  if (!dotSeen) {
    return cleaned;
  }

  const [wholeRaw, fractionalRaw = ''] = cleaned.split('.');
  const fractional = fractionalRaw.slice(0, TOKEN_DECIMALS);
  if (value.endsWith('.') && fractionalRaw.length === 0) {
    return `${wholeRaw || '0'}.`;
  }
  return fractional.length > 0 ? `${wholeRaw || '0'}.${fractional}` : `${wholeRaw || '0'}`;
}

function parseAmountToUint64(value: string): bigint | null {
  if (!value) return null;
  try {
    const parsed = parseUnits(value, TOKEN_DECIMALS);
    if (parsed < 0 || parsed > MAX_UINT64) {
      return null;
    }
    return parsed;
  } catch (err) {
    return null;
  }
}

function formatAmountFromUint64(value: bigint | string): string {
  try {
    const bigintValue = typeof value === 'bigint' ? value : BigInt(value);
    return formatUnits(bigintValue, TOKEN_DECIMALS);
  } catch (err) {
    return '';
  }
}

export function DistributorApp() {
  const { address: connected } = useAccount();
  const signerPromise = useEthersSigner();
  const { instance } = useZamaInstance();

  const [rows, setRows] = useState<Row[]>([{ address: '', amount: '' }]);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [addressToCheck, setAddressToCheck] = useState<string>('');
  const [customDecryptedBalance, setCustomDecryptedBalance] = useState<string>('');
  const [userDecryptedBalance, setUserDecryptedBalance] = useState<string>('');
  const [decryptingUser, setDecryptingUser] = useState(false);
  const [decryptingCustom, setDecryptingCustom] = useState(false);
  const [faucetAmount, setFaucetAmount] = useState<string>('100');
  const [faucetStatus, setFaucetStatus] = useState<string>('');

  const { data: encBalanceHandle, refetch: refetchCustomBalance } = useReadContract({
    address: CONFIDENTIAL_ETH_ADDRESS,
    abi: CONFIDENTIAL_ETH_ABI as any,
    functionName: 'confidentialBalanceOf',
    args: addressToCheck ? [addressToCheck] : undefined,
    query: { enabled: !!addressToCheck },
  });

  const { data: userEncBalanceHandle, refetch: refetchUserBalance } = useReadContract({
    address: CONFIDENTIAL_ETH_ADDRESS,
    abi: CONFIDENTIAL_ETH_ABI as any,
    functionName: 'confidentialBalanceOf',
    args: connected ? [connected] : undefined,
    query: { enabled: !!connected },
  });

  const canSend = useMemo(() => {
    if (!connected || !instance) return false;
    return rows.every(row => {
      if (!row.address) return false;
      const parsed = parseAmountToUint64(row.amount);
      return parsed !== null && parsed > 0n;
    });
  }, [connected, instance, rows]);

  const faucetAmountValid = useMemo(() => {
    const parsed = parseAmountToUint64(faucetAmount);
    return parsed !== null && parsed > 0n;
  }, [faucetAmount]);

  const updateRow = (i: number, key: keyof Row, val: string) => {
    setRows(prev =>
      prev.map((r, idx) => {
        if (idx !== i) return r;
        if (key === 'amount') {
          return { ...r, amount: sanitizeAmountInput(val) };
        }
        return { ...r, address: val };
      }),
    );
  };
  const addRow = () => setRows(prev => [...prev, { address: '', amount: '' }]);
  const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const distribute = async () => {
    if (!instance || !signerPromise) return;
    setSending(true);
    setStatus('Encrypting amounts...');
    try {
      const signer = await signerPromise;

      const parsedAmounts: bigint[] = [];
      rows.forEach((row, index) => {
        const parsed = parseAmountToUint64(row.amount);
        if (parsed === null || parsed === 0n) {
          throw new Error(`Error: invalid amount in row ${index + 1}`);
        }
        parsedAmounts.push(parsed);
      });

      const input = instance.createEncryptedInput(DISTRIBUTOR_ADDRESS, await signer.getAddress());
      for (const amount of parsedAmounts) {
        input.add64(amount);
      }
      const ciphertexts = await input.encrypt();

      setStatus('Sending transaction...');
      const distributor = new Contract(DISTRIBUTOR_ADDRESS, DISTRIBUTOR_ABI as any, signer);
      const tx = await distributor.batchDistributeEncrypted(
        rows.map(r => r.address),
        ciphertexts.handles,
        ciphertexts.inputProof,
      );
      setStatus(`Waiting for confirmation: ${tx.hash}`);
      await tx.wait();
      setStatus('Distribution confirmed');
      await Promise.all([refetchUserBalance?.(), refetchCustomBalance?.()]);
    } catch (e) {
      console.error(e);
      if (e instanceof Error && e.message.startsWith('Error:')) {
        setStatus(e.message);
      } else {
        setStatus('Error: transaction failed');
      }
    } finally {
      setSending(false);
    }
  };

  const decryptHandle = async (
    handle: string,
    expectedOwner: string,
    setBalance: (val: string) => void,
    setWorking: (val: boolean) => void,
  ) => {
    if (!instance || !handle || !signerPromise) return;
    setBalance('');
    setWorking(true);
    try {
      const keypair = instance.generateKeypair();
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [CONFIDENTIAL_ETH_ADDRESS];
      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);
      const signer = await signerPromise;
      if (!signer) throw new Error('No signer');
      const owner = await signer.getAddress();
      if (expectedOwner && owner.toLowerCase() !== expectedOwner.toLowerCase()) {
        throw new Error('Connected wallet does not match balance owner');
      }
      const signature = await signer.signTypedData(eip712.domain, { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification }, eip712.message);
      const res = await instance.userDecrypt([
        { handle, contractAddress: CONFIDENTIAL_ETH_ADDRESS },
      ], keypair.privateKey, keypair.publicKey, signature.replace('0x',''), contractAddresses, owner, startTimeStamp, durationDays);
      const value = res[handle];
      const formatted = formatAmountFromUint64(value);
      setBalance(formatted || 'Error');
    } catch (e) {
      console.error(e);
      setBalance('Error');
    }
    setWorking(false);
  };

  const decryptUserBalance = async () => {
    if (!connected || !userEncBalanceHandle) return;
    await decryptHandle(userEncBalanceHandle as string, connected, setUserDecryptedBalance, setDecryptingUser);
  };

  const decryptCustomBalance = async () => {
    if (!addressToCheck || !encBalanceHandle) return;
    await decryptHandle(encBalanceHandle as string, addressToCheck, setCustomDecryptedBalance, setDecryptingCustom);
  };

  const faucet = async () => {
    setFaucetStatus('');
    if (!signerPromise) {
      setFaucetStatus('Error: connect a wallet');
      return;
    }
    try {
      const parsedAmount = parseAmountToUint64(faucetAmount);
      if (parsedAmount === null || parsedAmount === 0n) {
        setFaucetStatus(`Error: amount must be greater than 0 and at most ${MAX_DISPLAY_AMOUNT}`);
        return;
      }
      setFaucetStatus('Requesting faucet...');
      const signer = await signerPromise;
      if (!signer) {
        setFaucetStatus('Error: no signer connected');
        return;
      }
      const token = new Contract(CONFIDENTIAL_ETH_ADDRESS, CONFIDENTIAL_ETH_ABI as any, signer);
      const tx = await token.mint(await signer.getAddress(), parsedAmount);
      setFaucetStatus(`Waiting for confirmation: ${tx.hash}`);
      await tx.wait();
      setFaucetStatus(`Faucet mint confirmed: ${formatAmountFromUint64(parsedAmount)} cETH`);
      await Promise.all([refetchUserBalance?.(), refetchCustomBalance?.()]);
    } catch (e) {
      console.error(e);
      setFaucetStatus('Error: faucet transaction failed');
    }
  };

  return (
    <div className="distributor-app">
      <Header />

      <main className="main-content">
        {/* Batch Distribution Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-icon">📦</span>
            <h2 className="card-title">Confidential Batch Distribution</h2>
          </div>
          <p className="card-description">
            Distribute encrypted tokens to multiple recipients in a single transaction. All amounts are encrypted client-side using Zama FHE technology before being sent on-chain.
          </p>

          {rows.map((r, i) => (
            <div key={i} className="recipient-row">
              <input
                placeholder="0xRecipient Address"
                value={r.address}
                onChange={e => updateRow(i, 'address', e.target.value)}
                className="input-field input-address"
              />
              <input
                placeholder="Amount"
                value={r.amount}
                onChange={e => updateRow(i, 'amount', e.target.value)}
                className="input-field input-amount"
              />
              {rows.length > 1 && (
                <button onClick={() => removeRow(i)} className="button button-danger">
                  🗑️
                </button>
              )}
            </div>
          ))}

          <div className="button-group">
            <button onClick={addRow} className="button button-secondary">
              ➕ Add Recipient
            </button>
            <button
              disabled={!canSend || sending}
              onClick={distribute}
              className="button button-primary"
            >
              {sending && <span className="loading-spinner"></span>}
              {sending ? 'Distributing...' : '🚀 Distribute Tokens'}
            </button>
          </div>

          {status && (
            <div className={`status-message ${
              status.includes('Error') ? 'status-error' :
              status.includes('confirmed') ? 'status-success' :
              'status-info'
            }`}>
              {status}
            </div>
          )}

          <div className="info-box">
            <span className="info-icon">💡</span>
            <div className="info-text">
              Maximum amount per entry: {MAX_DISPLAY_AMOUNT} cETH. Supports up to 6 decimal places.
            </div>
          </div>
        </div>

        {/* Your Balance Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-icon">💰</span>
            <h2 className="card-title">Your Encrypted Balance</h2>
          </div>

          {connected ? (
            <>
              <div className="connected-wallet">
                <span className="wallet-icon">🔗</span>
                <span className="wallet-address">{connected}</span>
              </div>

              <div className="balance-display">
                <div className="balance-label">Encrypted Handle:</div>
                <div className="balance-value">
                  {userEncBalanceHandle ? String(userEncBalanceHandle) : 'Loading...'}
                </div>
              </div>

              <button
                disabled={!userEncBalanceHandle || decryptingUser}
                onClick={decryptUserBalance}
                className="button button-primary"
              >
                {decryptingUser && <span className="loading-spinner"></span>}
                {decryptingUser ? 'Decrypting...' : '🔓 Decrypt My Balance'}
              </button>

              {userDecryptedBalance && (
                <div className="balance-display" style={{ marginTop: '1rem' }}>
                  <div className="balance-label">Decrypted Balance:</div>
                  <div className="balance-decrypted">{userDecryptedBalance} cETH</div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔌</div>
              <p className="empty-state-text">Connect your wallet to view your encrypted balance</p>
            </div>
          )}
        </div>

        {/* Faucet Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-icon">🚰</span>
            <h2 className="card-title">Test Token Faucet</h2>
          </div>
          <p className="card-description">
            Get test cETH tokens for free. These tokens are encrypted and can be used for testing distributions.
          </p>

          <div className="input-group">
            <input
              placeholder="Amount (e.g., 100)"
              value={faucetAmount}
              onChange={e => setFaucetAmount(sanitizeAmountInput(e.target.value))}
              className="input-field"
            />
            <button
              onClick={faucet}
              disabled={!connected || !faucetAmountValid}
              className="button button-primary"
            >
              💧 Get Tokens
            </button>
          </div>

          {faucetStatus && (
            <div className={`status-message ${
              faucetStatus.includes('Error') ? 'status-error' : 'status-success'
            }`}>
              {faucetStatus}
            </div>
          )}
        </div>

        {/* Check Any Balance Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-icon">🔍</span>
            <h2 className="card-title">Check Any Address Balance</h2>
          </div>
          <p className="card-description">
            Check the encrypted balance of any address. You can only decrypt if you own the address.
          </p>

          <div className="input-group">
            <input
              placeholder="0xAddress to check"
              value={addressToCheck}
              onChange={e => setAddressToCheck(e.target.value)}
              className="input-field"
            />
            <button
              disabled={!encBalanceHandle || decryptingCustom}
              onClick={decryptCustomBalance}
              className="button button-primary"
            >
              {decryptingCustom && <span className="loading-spinner"></span>}
              {decryptingCustom ? 'Decrypting...' : '🔓 Decrypt'}
            </button>
          </div>

          {encBalanceHandle && (
            <div className="balance-display">
              <div className="balance-label">Encrypted Handle:</div>
              <div className="balance-value">{encBalanceHandle.toString()}</div>
            </div>
          )}

          {customDecryptedBalance && (
            <div className="balance-display" style={{ marginTop: '1rem' }}>
              <div className="balance-label">Decrypted Balance:</div>
              <div className="balance-decrypted">{customDecryptedBalance} cETH</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
