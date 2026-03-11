const BASE_URL = 'https://starterkitnet.onrender.com/api';
const TIMEOUT_MS = 6000;

function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
    ),
  ]);
}

export interface ApiProduct {
  id: string;
  code: string;
  name: string;
  stock: number;
  status: string;
}

export interface ApiTransaction {
  id: string;
  time: string;
  type: 1 | 2; // 1 = import, 2 = export
  productID: string;
  quantity: number;
  note: string;
  product: ApiProduct | null;
}

export interface ApiLog {
  id: string;
  time: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
}

export const api = {
  async getProducts(): Promise<ApiProduct[]> {
    const res = await fetchWithTimeout(`${BASE_URL}/Products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async createProduct(code: string, name: string): Promise<ApiProduct> {
    const res = await fetchWithTimeout(`${BASE_URL}/Products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, name }),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async getTransactions(): Promise<ApiTransaction[]> {
    const res = await fetchWithTimeout(`${BASE_URL}/Products/transactions`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  async getLogs(take = 50): Promise<ApiLog[]> {
    const res = await fetchWithTimeout(`${BASE_URL}/Logs?take=${take}`);
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
  },

  async importStock(productId: string, quantity: number, note: string): Promise<string> {
    const res = await fetchWithTimeout(
      `${BASE_URL}/Products/${productId}/import?quantity=${quantity}&note=${encodeURIComponent(note)}`,
      { method: 'POST' }
    );
    if (!res.ok) throw new Error('Import failed');
    return res.text();
  },

  async exportStock(productId: string, quantity: number, note: string): Promise<string> {
    const res = await fetchWithTimeout(
      `${BASE_URL}/Products/${productId}/export?quantity=${quantity}&note=${encodeURIComponent(note)}`,
      { method: 'POST' }
    );
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Export failed');
    }
    return res.text();
  },
};
