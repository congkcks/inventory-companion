export interface Product {
  id: string;
  code: string;
  name: string;
  quantity: number;
  threshold: number;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: 'import' | 'export';
  quantity: number;
  note: string;
  date: string;
}

export interface LogEntry {
  id: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  timestamp: string;
}

export type ProductStatus = 'normal' | 'low' | 'out';

export function getProductStatus(product: Product): ProductStatus {
  if (product.quantity <= 0) return 'out';
  if (product.quantity <= product.threshold) return 'low';
  return 'normal';
}

export function getStatusLabel(status: ProductStatus): string {
  switch (status) {
    case 'normal': return 'Bình thường';
    case 'low': return 'Sắp hết';
    case 'out': return 'Hết hàng';
  }
}
