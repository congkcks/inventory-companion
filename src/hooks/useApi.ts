import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { mockProducts, mockTransactions, mockLogs } from '@/lib/mockData';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const data = await api.getProducts();
        return data.length > 0 ? data : mockProducts;
      } catch {
        return mockProducts;
      }
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ code, name }: { code: string; name: string }) =>
      api.createProduct(code, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      try {
        const data = await api.getTransactions();
        return data.length > 0 ? data : mockTransactions;
      } catch {
        return mockTransactions;
      }
    },
  });
}

export function useLogs(take = 50) {
  return useQuery({
    queryKey: ['logs', take],
    queryFn: async () => {
      try {
        const data = await api.getLogs(take);
        return data.length > 0 ? data : mockLogs;
      } catch {
        return mockLogs;
      }
    },
    refetchInterval: 5000,
  });
}

export function useImportStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity, note }: { productId: string; quantity: number; note: string }) =>
      api.importStock(productId, quantity, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useExportStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity, note }: { productId: string; quantity: number; note: string }) =>
      api.exportStock(productId, quantity, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}
