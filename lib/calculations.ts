// import { prisma } from '@/db';

// export async function calculateRemainingStock(supplierId: string): Promise<number> {
//   const deliveries = await prisma.delivery.findMany({
//     where: { supplierId, isCompleted: false },
//   });

//   return deliveries.reduce((total, d) => total + d.quantityRemaining, 0);
// }

// export async function calculateTotalSold(supplierId: string): Promise<number> {
//   const result = await prisma.saleEntry.aggregate({
//     where: { supplierId },
//     _sum: { quantitySold: true },
//   });

//   return result._sum.quantitySold || 0;
// }

// export async function calculateTotalCost(supplierId: string): Promise<number> {
//   const deliveries = await prisma.delivery.findMany({
//     where: { supplierId },
//   });

//   let totalCost = 0;
//   for (const delivery of deliveries) {
//     const sold = await prisma.saleEntry.aggregate({
//       where: { deliveryId: delivery.id },
//       _sum: { quantitySold: true },
//     });
//     const quantitySold = sold._sum.quantitySold || 0;
//     totalCost += quantitySold * delivery.costPrice;
//   }

//   return totalCost;
// }

// export async function calculateTotalRevenue(supplierId: string): Promise<number> {
//   const result = await prisma.saleEntry.aggregate({
//     where: { supplierId },
//     _sum: { totalRevenue: true },
//   });

//   return result._sum.totalRevenue || 0;
// }

// export async function calculateTotalPayments(supplierId: string): Promise<number> {
//   const result = await prisma.payment.aggregate({
//     where: { supplierId },
//     _sum: { amount: true },
//   });

//   return result._sum.amount || 0;
// }

// export async function calculateBalanceDue(supplierId: string): Promise<number> {
//   const totalCost = await calculateTotalCost(supplierId);
//   const totalPayments = await calculateTotalPayments(supplierId);

//   return Math.max(0, totalCost - totalPayments);
// }

// export async function deductStockFromOldestDelivery(
//   supplierId: string,
//   quantity: number
// ): Promise<string[]> {
//   const completedDeliveryIds: string[] = [];

//   // Get all active deliveries ordered by date (oldest first)
//   const deliveries = await prisma.delivery.findMany({
//     where: { supplierId, isCompleted: false },
//     orderBy: { dateReceived: 'asc' },
//   });

//   let remainingQty = quantity;

//   for (const delivery of deliveries) {
//     if (remainingQty <= 0) break;

//     const deductQty = Math.min(remainingQty, delivery.quantityRemaining);
//     const newRemaining = delivery.quantityRemaining - deductQty;

//     await prisma.delivery.update({
//       where: { id: delivery.id },
//       data: { quantityRemaining: newRemaining },
//     });

//     if (newRemaining === 0) {
//       await prisma.delivery.update({
//         where: { id: delivery.id },
//         data: { isCompleted: true },
//       });
//       completedDeliveryIds.push(delivery.id);
//     }

//     remainingQty -= deductQty;
//   }

//   return completedDeliveryIds;
// }

// export async function getTotalGlobalStock(): Promise<number> {
//   const deliveries = await prisma.delivery.findMany({
//     where: { isCompleted: false },
//   });

//   return deliveries.reduce((total, d) => total + d.quantityRemaining, 0);
// }

// export async function getTotalOutstandingBalance(): Promise<number> {
//   const suppliers = await prisma.supplier.findMany();
//   let totalBalance = 0;

//   for (const supplier of suppliers) {
//     const balance = await calculateBalanceDue(supplier.id);
//     totalBalance += balance;
//   }

//   return totalBalance;
// }
