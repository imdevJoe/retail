import { DebtRepository } from '@/repositories/debt.repository';
import { debtSchema, DebtInput } from '@/lib/schemas';
import debtCalculations from '@/calculations/debtCalculations';

export class DebtService {
  static async createDebt(input: unknown) {
    const validated = debtSchema.parse(input) as DebtInput;
    return DebtRepository.createDebt(validated);
  }

  static async listDebts() {
    return DebtRepository.listDebts();
  }

  static async getDebtById(id: string) {
    const debt = await DebtRepository.getDebtById(id);
    if (!debt) return null;

    const totalForStock = await debtCalculations.getTotalDebtsForStock(debt.stockId);
    return { ...debt, totalForStock };
  }
}

export default DebtService;
