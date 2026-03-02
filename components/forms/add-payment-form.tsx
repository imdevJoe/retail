'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, type PaymentInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AddPaymentFormProps {
  supplierId?: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function AddPaymentForm({
  supplierId: defaultSupplierId,
  onSuccess,
  trigger,
}: AddPaymentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      supplierId: defaultSupplierId,
    },
  });

  useEffect(() => {
    if (isOpen && !defaultSupplierId) {
      setLoadingSuppliers(true);
      fetch('/api/suppliers')
        .then((res) => res.json())
        .then(setSuppliers)
        .catch(() => setError('Failed to load suppliers'))
        .finally(() => setLoadingSuppliers(false));
    }
  }, [isOpen, defaultSupplierId]);

  const onSubmit = async (data: PaymentInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add payment');
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
        {trigger || (
          <Button className="bg-[#9BC264] hover:bg-[#89A855] text-white">
            Add Payment
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Payment</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!defaultSupplierId && (
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
                    {supplier.name}
                  </option>
                ))}
              </select>
              {errors.supplierId && (
                <p className="text-red-500 text-xs mt-1">{errors.supplierId.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              {...register('amount')}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9BC264]"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
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
              {isLoading ? 'Adding...' : 'Add Payment'}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
