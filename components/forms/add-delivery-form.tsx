'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliverySchema, type DeliveryInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Supplier {
  id: string;
  name: string;
}

interface AddDeliveryFormProps {
  onSuccess?: () => void;
}

export function AddDeliveryForm({ onSuccess }: AddDeliveryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeliveryInput>({
    resolver: zodResolver(deliverySchema),
  });

  useEffect(() => {
    if (isOpen) {
      setLoadingSuppliers(true);
      fetch('/api/suppliers')
        .then((res) => res.json())
        .then(setSuppliers)
        .catch(() => setError('Failed to load suppliers'))
        .finally(() => setLoadingSuppliers(false));
    }
  }, [isOpen]);

  const onSubmit = async (data: DeliveryInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add delivery');
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
        <Button className="bg-[#F7DB91] hover:bg-[#F0D07C] text-gray-900">
          Add Delivery
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Delivery</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Supplier</label>
            <select
              {...register('supplierId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F7DB91]"
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

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              {...register('quantityReceived')}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F7DB91]"
              placeholder="0"
            />
            {errors.quantityReceived && (
              <p className="text-red-500 text-xs mt-1">{errors.quantityReceived.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cost Price per Unit</label>
            <input
              {...register('costPrice')}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F7DB91]"
              placeholder="0.00"
            />
            {errors.costPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.costPrice.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#F7DB91] hover:bg-[#F0D07C] text-gray-900"
            >
              {isLoading ? 'Adding...' : 'Add Delivery'}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
