import { StockRepository } from '@/repositories/stock.repository';
import { stockSchema, StockInput } from '@/lib/schemas';
import stockCalculations from '@/calculations/stockCalculations';
import { StockStatus } from '@prisma/client';

export class StockService {
  static async createStock(input: unknown) {
    const validated = stockSchema.parse(input) as StockInput;
    return StockRepository.createStock(validated);
  }

  static async getStockById(id: string) {
    const stock = await StockRepository.getStockById(id);
    if (!stock) return null;

    const totalSales = await stockCalculations.getTotalSalesForStock(id);
    const totalDebts = await stockCalculations.getTotalDebtsForStock(id);

    return { ...stock, totalSales, totalDebts };
  }

  static async listActiveStocks() {
    const stocks = await StockRepository.listActiveStocks();

    const withTotals = await Promise.all(
      stocks.map(async (s) => ({
        ...s,
        totalSales: await stockCalculations.getTotalSalesForStock(s.id),
        totalDebts: await stockCalculations.getTotalDebtsForStock(s.id),
      }))
    );

    return withTotals;
  }

  static async updateStatus(id: string, status: StockStatus) {
    return StockRepository.updateStatus(id, status);
  }

  static async countActiveStocks(): Promise<number> {
    const stocks = await StockRepository.listActiveStocks();
    return stocks.length;
  }
}

export default StockService;
