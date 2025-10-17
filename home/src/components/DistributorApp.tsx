import { useMemo, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Contract } from 'ethers';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { Header } from './Header';
import { DISTRIBUTOR_ADDRESS, DISTRIBUTOR_ABI, CONFIDENTIAL_ETH_ABI, CONFIDENTIAL_ETH_ADDRESS } from '../config/contracts';

type Row = { address: string; amount: string };

export function DistributorApp() {
  const { address: connected } = useAccount();
  const signerPromise = useEthersSigner();
  const { instance } = useZamaInstance();

  const [rows, setRows] = useState<Row[]>([{ address: '', amount: '' }]);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [addressToCheck, setAddressToCheck] = useState<string>('');
  const [decryptedBalance, setDecryptedBalance] = useState<string>('');

  const { data: encBalanceHandle } = useReadContract({
    address: CONFIDENTIAL_ETH_ADDRESS,
    abi: CONFIDENTIAL_ETH_ABI as any,
    functionName: 'confidentialBalanceOf',
    args: addressToCheck ? [addressToCheck] : undefined,
    query: { enabled: !!addressToCheck },
  });

  const canSend = useMemo(() => {
    return !!connected && !!instance && rows.every(r => r.address && r.amount && !Number.isNaN(parseInt(r.amount)));
  }, [connected, instance, rows]);

  const updateRow = (i: number, key: keyof Row, val: string) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  };
  const addRow = () => setRows(prev => [...prev, { address: '', amount: '' }]);
  const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const distribute = async () => {
    if (!instance || !signerPromise) return;
    setSending(true);
    setStatus('Encrypting amounts...');
    try {
      const signer = await signerPromise;

      const input = instance.createEncryptedInput(DISTRIBUTOR_ADDRESS, await signer.getAddress());
      for (const r of rows) input.add64(BigInt(r.amount));
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
    } catch (e) {
      console.error(e);
      setStatus('Error: transaction failed');
    } finally {
      setSending(false);
    }
  };

  const decryptBalance = async () => {
    if (!instance || !encBalanceHandle) return;
    setDecryptedBalance('');
    try {
      const keypair = instance.generateKeypair();
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [CONFIDENTIAL_ETH_ADDRESS];
      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);
      const signer = await signerPromise;
      if (!signer) throw new Error('No signer');
      const signature = await signer.signTypedData(eip712.domain, { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification }, eip712.message);
      const res = await instance.userDecrypt([
        { handle: encBalanceHandle as string, contractAddress: CONFIDENTIAL_ETH_ADDRESS },
      ], keypair.privateKey, keypair.publicKey, signature.replace('0x',''), contractAddresses, await signer.getAddress(), startTimeStamp, durationDays);
      const value = res[encBalanceHandle as string];
      setDecryptedBalance(String(value));
    } catch (e) {
      console.error(e);
      setDecryptedBalance('Error');
    }
  };

  return (
    <div className="distributor-app">
      <Header />
      <main className="main-content">
        <div className="card" style={{ background: 'white', borderRadius: 8, padding: 16, maxWidth: 900, margin: '0 auto' }}>
          <h2>Confidential Batch Distribution</h2>
          <p style={{ color: '#6b7280' }}>Enter recipients and amounts. Amounts are encrypted with Zama before submission.</p>

          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input placeholder="0xRecipient" value={r.address} onChange={e => updateRow(i, 'address', e.target.value)} style={{ flex: 3, padding: 8, border: '1px solid #e5e7eb', borderRadius: 6 }} />
              <input placeholder="Amount (uint64)" value={r.amount} onChange={e => updateRow(i, 'amount', e.target.value)} style={{ flex: 1, padding: 8, border: '1px solid #e5e7eb', borderRadius: 6 }} />
              <button onClick={() => removeRow(i)} style={{ padding: '8px 12px' }}>Remove</button>
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <button onClick={addRow} style={{ padding: '8px 12px', marginRight: 8 }}>Add Row</button>
            <button disabled={!canSend || sending} onClick={distribute} style={{ padding: '8px 12px' }}>
              {sending ? 'Submitting...' : 'Distribute'}
            </button>
          </div>
          {status && <p style={{ marginTop: 8, color: '#374151' }}>{status}</p>}
        </div>

        <div className="card" style={{ background: 'white', borderRadius: 8, padding: 16, maxWidth: 900, margin: '16px auto' }}>
          <h3>Check Balance (decrypt)</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="0xAddress" value={addressToCheck} onChange={e => setAddressToCheck(e.target.value)} style={{ flex: 1, padding: 8, border: '1px solid #e5e7eb', borderRadius: 6 }} />
            <button disabled={!encBalanceHandle || !instance} onClick={decryptBalance} style={{ padding: '8px 12px' }}>Decrypt</button>
          </div>
          {encBalanceHandle && (<p style={{ color: '#6b7280', marginTop: 8 }}>Encrypted handle: {String(encBalanceHandle)}</p>)}
          {decryptedBalance && (<p style={{ color: '#111827', marginTop: 8 }}>Decrypted balance: {decryptedBalance}</p>)}
        </div>
      </main>
    </div>
  );
}

