import { prisma } from '@/db';
import { StockInput } from '@/lib/schemas';
import { StockStatus } from '@prisma/client';

export class StockRepository {
  /** Create a new stock record*/
  static async createStock(input: StockInput) {
    return prisma.stock.create({
      data: {
        productName: input.productName,
        ownerName: input.ownerName,
        numberOfBags: input.numberOfBags,
        estimatedRevenue: input.estimatedRevenue,
      },
    });
  }

  /**
   * Retrieve a stock by ID
   */
  static async getStockById(id: string) {
    return prisma.stock.findUnique({
      where: { id },
      include: {
        sales: true,
        debts: true,
      },
    });
  }

  /* List all active stocks */
  static async listActiveStocks() {
    return prisma.stock.findMany({
      where: {
        status: StockStatus.ACTIVE,
      },
      include: {
        sales: true,
        debts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update stock status
   */
  static async updateStatus(id: string, status: StockStatus) {
    return prisma.stock.update({
      where: { id },
      data: { status },
    });
  }
}
