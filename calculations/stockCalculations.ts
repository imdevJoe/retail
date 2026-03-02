import { prisma } from '@/db';

const stockCalculations = {
  async getTotalSalesForStock(stockId: string): Promise<number> {
    const result = await prisma.sale.aggregate({
      where: { stockId },
      _sum: { amount: true },
    });

    return result._sum.amount ?? 0;
  },

  async getTotalDebtsForStock(stockId: string): Promise<number> {
    const result = await prisma.debt.aggregate({
      where: { stockId },
      _sum: { amount: true },
    });

    return result._sum.amount ?? 0;
  },

  async getOutstandingDebtsForStock(stockId: string): Promise<number> {
    const result = await prisma.debt.aggregate({
      where: { stockId, isPaid: false },
      _sum: { amount: true },
    });

    return result._sum.amount ?? 0;
  },

  
};

export default stockCalculations;
