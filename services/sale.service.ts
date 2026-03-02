import { SaleRepository } from '@/repositories/sale.repository';
import { saleSchema, SaleInput } from '@/lib/schemas';
import saleCalculations from '@/calculations/saleCalculations';

export class SaleService {
  static async createSale(input: unknown) {
    const validated = saleSchema.parse(input) as SaleInput;
    return SaleRepository.createSale(validated);
  }

  static async listSales() {
    const sales = await SaleRepository.listSales();

    // add any computed fields if needed in future
    return sales;
  }

  static async getSaleById(id: string) {
    const sale = await SaleRepository.getSaleById(id);
    if (!sale) return null;

    const totalForStock = await saleCalculations.getTotalSalesForStock(sale.stockId);

    return { ...sale, totalForStock };
  }
}

export default SaleService;
