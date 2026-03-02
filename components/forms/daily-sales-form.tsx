'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saleEntrySchema, type SaleEntryInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SupplierWithStock {
  id: string;
  name: string;
  remainingStock: number;
}

interface DailySalesFormProps {
  onSuccess?: () => void;
}

export function DailySalesForm({ onSuccess }: DailySalesFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierWithStock[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierWithStock | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<SaleEntryInput>({
    resolver: zodResolver(saleEntrySchema),
  });

  const supplierId = watch('supplierId');

  useEffect(() => {
    if (isOpen) {
      setLoadingSuppliers(true);
      fetch('/api/suppliers')
        .then((res) => res.json())
        .then(async (suppliers) => {
          // For each supplier, calculate remaining stock
          const suppliersWithStock = await Promise.all(
            suppliers.map(async (supplier) => {
              const deliveries = await fetch(
                `/api/suppliers/${supplier.id}`
              )
                .then((res) => res.json())
                .then((data) => data.deliveries || []);

              const remainingStock = deliveries
                .filter((d: any) => !d.isCompleted)
                .reduce((sum: number, d: any) => sum + d.quantityRemaining, 0);

              return {
                ...supplier,
                remainingStock,
              };
            })
          );

          setSuppliers(suppliersWithStock.filter((s) => s.remainingStock > 0));
        })
        .catch(() => setError('Failed to load suppliers'))
        .finally(() => setLoadingSuppliers(false));
    }
  }, [isOpen]);

  useEffect(() => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    setSelectedSupplier(supplier || null);
  }, [supplierId, suppliers]);

  const onSubmit = async (data: SaleEntryInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/daily-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to record sale');
      }

      reset();
      setIsOpen(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-[#9BC264] hover:bg-[#89A855] text-white">
          Record Sale
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Record Daily Sale</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Supplier</label>
            <select
              {...register('supplierId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9BC264]"
              disabled={loadingSuppliers}
            >
              <option value="">
                {loadingSuppliers ? 'Loading...' : 'Select a supplier'}
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} (Stock: {supplier.remainingStock})
                </option>
              ))}
            </select>
            {errors.supplierId && (
              <p className="text-red-500 text-xs mt-1">{errors.supplierId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Quantity Sold
              {selectedSupplier && (
                <span className="text-gray-500 ml-1">
                  (Max: {selectedSupplier.remainingStock})
                </span>
              )}
            </label>
            <input
              {...register('quantitySold')}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9BC264]"
              placeholder="0"
            />
            {errors.quantitySold && (
              <p className="text-red-500 text-xs mt-1">{errors.quantitySold.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Selling Price per Unit</label>
            <input
              {...register('sellingPrice')}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9BC264]"
              placeholder="0.00"
            />
            {errors.sellingPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.sellingPrice.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#9BC264] hover:bg-[#89A855] text-white"
            >
              {isLoading ? 'Recording...' : 'Record Sale'}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
