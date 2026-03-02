import { prisma } from '@/db';
import { DebtInput } from '@/lib/schemas';

export class DebtRepository {
  static async createDebt(input: DebtInput) {
    return prisma.debt.create({
      data: {
        stockId: input.stockId,
        debtorName: input.debtorName,
        amount: input.amount,
      },
      include: { stock: true },
    });
  }

  static async listDebts() {
    return prisma.debt.findMany({
      include: { stock: true },
      orderBy: { date: 'desc' },
    });
  }

  static async getDebtById(id: string) {
    return prisma.debt.findUnique({ where: { id }, include: { stock: true } });
  }
}

export default DebtRepository;
