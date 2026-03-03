import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: api.getTransactions,
  });
}

export function useLogs(take = 50) {
  return useQuery({
    queryKey: ['logs', take],
    queryFn: () => api.getLogs(take),
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
