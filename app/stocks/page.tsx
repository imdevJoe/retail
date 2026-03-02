import StockService from "@/services/stock.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function StockPage() {
  let stocks: any[] = [];
  let error: string | null = null;

  try {
    const results = await Promise.all([StockService.listActiveStocks()]);
    stocks = results[0];
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Failed to load stocks. Please try again.";
  }

  return (
    <main className="min-h-screen bg-[#FFFDCE] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Stocks</h1>
          <p className="text-gray-600">Manage your stock inventory</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Stocks Table */}
        {!error && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {stocks.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No active stocks found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Owner Name</TableHead>
                    <TableHead>Bags</TableHead>
                    <TableHead>Est. Revenue</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Total Debts</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        {stock.productName}
                      </TableCell>
                      <TableCell>{stock.ownerName}</TableCell>
                      <TableCell>{stock.numberOfBags}</TableCell>
                      <TableCell>₵{stock.estimatedRevenue.toFixed(2)}</TableCell>
                      <TableCell>₵{stock.totalSales?.toFixed(2) ?? 0}</TableCell>
                      <TableCell>₵{stock.totalDebts?.toFixed(2) ?? 0}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            stock.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {stock.status}
                        </span>
                      </TableCell>
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