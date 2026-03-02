import { prisma } from '@/db';

const saleCalculations = {
  async getTotalSalesForStock(stockId: string): Promise<number> {
    const result = await prisma.sale.aggregate({
      where: { stockId },
      _sum: { amount: true },
    });

    return result._sum.amount ?? 0;
  },
};

export default saleCalculations;
