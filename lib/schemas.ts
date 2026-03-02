import { z } from 'zod';

export const stockSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  numberOfBags: z.coerce.number().int().min(1, 'Number of bags must be at least 1'),
  estimatedRevenue: z.coerce.number().min(0, 'Estimated revenue must be non-negative'),
});

export const saleSchema = z.object({
  stockId: z.string().min(1, 'Stock is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
});

export const debtSchema = z.object({
  stockId: z.string().min(1, 'Stock is required'),
  debtorName: z.string().min(1, 'Debtor name is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
});

export type StockInput = z.infer<typeof stockSchema>;
export type SaleInput = z.infer<typeof saleSchema>;
export type DebtInput = z.infer<typeof debtSchema>;


