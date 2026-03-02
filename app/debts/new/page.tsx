'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listStocks } from '@/lib/apiCalls/stock';
import { createDebt } from '@/lib/apiCalls/debt';

export default function NewDebtPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<any[]>([]);
  const [stockId, setStockId] = useState('');
  const [debtorName, setDebtorName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    listStocks()
      .then((s) => mounted && setStocks(s))
      .catch((e) => mounted && setError(e?.message || 'Failed to load stocks'));
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!stockId) return setError('Please select a stock');
    if (!debtorName.trim()) return setError('Enter debtor name');
    const amt = parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) return setError('Enter a valid amount');

    try {
      setLoading(true);
      await createDebt({ stockId, debtorName, amount: amt });
      router.push('/debts');
    } catch (err: any) {
      setError(err?.message || 'Failed to create debt');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFDCE] p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">New Debt</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-100 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            <span className="text-sm font-medium">Stock</span>
            <select
              value={stockId}
              onChange={(e) => setStockId(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="">Select stock</option>
              {stocks.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.productName} — {s.ownerName}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium">Debtor Name</span>
            <input
              type="text"
              value={debtorName}
              onChange={(e) => setDebtorName(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium">Amount</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="e.g. 150.00"
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Save Debt'}
            </button>
            <button type="button" className="text-sm" onClick={() => router.push('/debts')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
