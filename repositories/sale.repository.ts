import { prisma } from '@/db';
import { SaleInput } from '@/lib/schemas';

export class SaleRepository {
  static async createSale(input: SaleInput) {
    return prisma.sale.create({
      data: {
        stockId: input.stockId,
        amount: input.amount,
      },
      include: { stock: true },
    });
  }

  static async listSales() {
    return prisma.sale.findMany({
      include: { stock: true },
      orderBy: { date: 'desc' },
    });
  }

  static async getSaleById(id: string) {
    return prisma.sale.findUnique({
      where: { id },
      include: { stock: true },
    });
  }
}

export default SaleRepository;
