import { prisma } from '@/db';

const debtCalculations = {
  async getTotalDebtsForStock(stockId: string): Promise<number> {
    const result = await prisma.debt.aggregate({
      where: { stockId },
      _sum: { amount: true },
    });

    return result._sum.amount ?? 0;
  },
};

export default debtCalculations;
