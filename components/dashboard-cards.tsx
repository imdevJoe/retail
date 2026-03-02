import { Card } from '@/components/ui/card';

interface DashboardCardsProps {
  totalStock: number;
  totalOutstanding: number;
  supplierCount: number;
}

export function DashboardCards({
  totalStock,
  totalOutstanding,
  supplierCount,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-white border border-gray-200">
        <div className="text-sm text-gray-600 font-medium mb-2">Total Remaining Stock</div>
        <div className="text-3xl font-bold text-[#9BC264]">{totalStock}</div>
        <div className="text-xs text-gray-500 mt-2">Units across all suppliers</div>
      </Card>

      <Card className="p-6 bg-white border border-gray-200">
        <div className="text-sm text-gray-600 font-medium mb-2">Outstanding Balance</div>
        <div className="text-3xl font-bold text-[#F075AE]">
          {totalOutstanding.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500 mt-2">Total amount owed to suppliers</div>
      </Card>

      <Card className="p-6 bg-white border border-gray-200">
        <div className="text-sm text-gray-600 font-medium mb-2">Active Suppliers</div>
        <div className="text-3xl font-bold text-[#F7DB91]">{supplierCount}</div>
        <div className="text-xs text-gray-500 mt-2">Total number of suppliers</div>
      </Card>
    </div>
  );
}
