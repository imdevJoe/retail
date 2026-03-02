import DebtService from '@/services/debt.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

export default async function DebtsPage() {
  let debts: any[] = [];
  let error: string | null = null;

  try {
    debts = await DebtService.listDebts();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load debts';
  }

  return (
    <main className="min-h-screen bg-[#FFFDCE] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Debts</h1>
            <p className="text-gray-600">Outstanding debts</p>
          </div>
          <div>
            <Link href="/debts/new" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">New Debt</Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!error && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {debts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No debts recorded.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Debtor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{new Date(d.date).toLocaleString()}</TableCell>
                      <TableCell>{d.stock?.productName ?? '—'}</TableCell>
                      <TableCell>{d.debtorName}</TableCell>
                      <TableCell>₵{d.amount.toFixed(2)}</TableCell>
                      <TableCell>{d.isPaid ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
