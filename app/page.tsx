import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/db';
// import {
//   getTotalGlobalStock,
//   getTotalOutstandingBalance,
// } from '@/lib/calculations';
import { DashboardCards } from '@/components/dashboard-cards';
import { Button } from '@/components/ui/button';
import { listStocks } from '@/lib/apiCalls/stock';
import { StockService } from '@/services/stock.service';
// import { useMockApi, getMockDashboardMetrics, getMockSuppliers } from '@/lib/mock-api';

export const metadata: Metadata = {
  title: 'Fish Retail Dashboard',
  description: 'Manage your fish retail business inventory',
};

export default async function DashboardPage() {
  let totalStock = 0;
  let totalOutstanding = 0;
  let suppliers: any[] = [];
  let stocks: any[] = [];

  const results = await Promise.all([
    // getTotalGlobalStock(),
    // getTotalOutstandingBalance(),
    // prisma.supplier.findMany(),
    StockService.listActiveStocks(),
  ]);

  // totalStock = results[0];
  // totalOutstanding = results[1];
  // suppliers = results[2];
  stocks = results[0];

  console.log('Stocks with totals:', stocks);

  return (
    <main className="min-h-screen bg-[#FFFDCE] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fish Retail Dashboard</h1>
          <p className="text-gray-600">Manage your supplier inventory and sales</p>
        </div>

        {/* Dashboard Cards */}
        <div className="mb-8">
          <DashboardCards
            totalStock={stocks.length}
            totalOutstanding={totalOutstanding}
            supplierCount={suppliers.length}
          />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/stocks">
            <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-900 mb-1">Stocks</h3>
              <p className="text-sm text-gray-600">Manage stock inventory</p>
            </div>
          </Link>

          <Link href="/sales">
            <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="font-semibold text-gray-900 mb-1">Sales</h3>
              <p className="text-sm text-gray-600">Track sales and revenue</p>
            </div>
          </Link>

          <Link href="/debts">
            <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-900 mb-1">Debts</h3>
              <p className="text-sm text-gray-600">Manage outstanding debts</p>
            </div>
          </Link>

          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-1">Reports</h3>
            <p className="text-sm text-gray-600">View analytics</p>
          </div>
        </div>
      </div>
    </main>
  );
}
