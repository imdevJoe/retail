import SaleService from '@/services/sale.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

export default async function SalesPage() {
  let sales: any[] = [];
  let error: string | null = null;

  try {
    sales = await SaleService.listSales();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load sales';
  }

  return (
    <main className="min-h-screen bg-[#FFFDCE] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sales</h1>
            <p className="text-gray-600">Recorded sales</p>
          </div>
          <div>
            <Link href="/sales/new" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">New Sale</Link>
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
            {sales.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No sales recorded.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{new Date(s.date).toLocaleString()}</TableCell>
                      <TableCell>{s.stock?.productName ?? '—'}</TableCell>
                      <TableCell>₵{s.amount.toFixed(2)}</TableCell>
                      <TableCell>{s.stockId}</TableCell>
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
