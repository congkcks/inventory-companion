import { create } from 'zustand';
import { Product, Transaction, LogEntry } from '@/types/inventory';

interface InventoryState {
  products: Product[];
  transactions: Transaction[];
  logs: LogEntry[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  importStock: (productId: string, quantity: number, note: string) => boolean;
  exportStock: (productId: string, quantity: number, note: string) => { success: boolean; error?: string };
  addLog: (level: LogEntry['level'], message: string) => void;
}

const initialProducts: Product[] = [
  { id: '1', code: 'SP001', name: 'Laptop Dell XPS 15', quantity: 25, threshold: 5 },
  { id: '2', code: 'SP002', name: 'Chuột Logitech MX', quantity: 3, threshold: 10 },
  { id: '3', code: 'SP003', name: 'Bàn phím cơ Keychron', quantity: 0, threshold: 5 },
  { id: '4', code: 'SP004', name: 'Màn hình Samsung 27"', quantity: 42, threshold: 8 },
  { id: '5', code: 'SP005', name: 'Tai nghe Sony WH-1000', quantity: 7, threshold: 10 },
  { id: '6', code: 'SP006', name: 'Webcam Logitech C920', quantity: 15, threshold: 5 },
  { id: '7', code: 'SP007', name: 'USB-C Hub Anker', quantity: 2, threshold: 10 },
  { id: '8', code: 'SP008', name: 'Ổ cứng SSD 1TB', quantity: 50, threshold: 10 },
];

const initialTransactions: Transaction[] = [
  { id: '1', productId: '1', productName: 'Laptop Dell XPS 15', type: 'import', quantity: 10, note: 'Nhập lô mới', date: '2026-02-26T08:00:00' },
  { id: '2', productId: '4', productName: 'Màn hình Samsung 27"', type: 'export', quantity: 5, note: 'Xuất cho phòng IT', date: '2026-02-26T09:30:00' },
  { id: '3', productId: '2', productName: 'Chuột Logitech MX', type: 'export', quantity: 7, note: 'Xuất cho nhân viên mới', date: '2026-02-26T10:15:00' },
  { id: '4', productId: '8', productName: 'Ổ cứng SSD 1TB', type: 'import', quantity: 20, note: 'Bổ sung kho', date: '2026-02-26T11:00:00' },
  { id: '5', productId: '5', productName: 'Tai nghe Sony WH-1000', type: 'export', quantity: 3, note: 'Xuất cho team meeting', date: '2026-02-26T14:00:00' },
];

const initialLogs: LogEntry[] = [
  { id: '1', level: 'INFO', message: 'Hệ thống khởi động thành công', timestamp: '2026-02-26T07:00:00' },
  { id: '2', level: 'INFO', message: 'Nhập kho 10 Laptop Dell XPS 15', timestamp: '2026-02-26T08:00:00' },
  { id: '3', level: 'WARNING', message: 'Sản phẩm "Chuột Logitech MX" sắp hết hàng (còn 3)', timestamp: '2026-02-26T10:15:00' },
  { id: '4', level: 'ERROR', message: 'Sản phẩm "Bàn phím cơ Keychron" đã hết hàng', timestamp: '2026-02-26T10:30:00' },
  { id: '5', level: 'INFO', message: 'Xuất kho 5 Màn hình Samsung 27"', timestamp: '2026-02-26T09:30:00' },
];

let nextId = 100;

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: initialProducts,
  transactions: initialTransactions,
  logs: initialLogs,

  addProduct: (product) => {
    const id = String(nextId++);
    set((state) => ({
      products: [...state.products, { ...product, id }],
    }));
    get().addLog('INFO', `Thêm sản phẩm mới: ${product.name}`);
  },

  updateProduct: (id, data) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
    get().addLog('INFO', `Cập nhật sản phẩm ID: ${id}`);
  },

  deleteProduct: (id) => {
    const product = get().products.find((p) => p.id === id);
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
    get().addLog('WARNING', `Xóa sản phẩm: ${product?.name || id}`);
  },

  importStock: (productId, quantity, note) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return false;

    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + quantity } : p
      ),
      transactions: [
        {
          id: String(nextId++),
          productId,
          productName: product.name,
          type: 'import',
          quantity,
          note,
          date: new Date().toISOString(),
        },
        ...state.transactions,
      ],
    }));
    get().addLog('INFO', `Nhập kho ${quantity} ${product.name}`);
    return true;
  },

  exportStock: (productId, quantity, note) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return { success: false, error: 'Sản phẩm không tồn tại' };
    if (product.quantity < quantity) {
      get().addLog('ERROR', `Xuất kho thất bại: ${product.name} - tồn kho (${product.quantity}) < yêu cầu (${quantity})`);
      return { success: false, error: `Số lượng tồn kho (${product.quantity}) không đủ để xuất ${quantity}` };
    }

    const newQty = product.quantity - quantity;
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, quantity: newQty } : p
      ),
      transactions: [
        {
          id: String(nextId++),
          productId,
          productName: product.name,
          type: 'export',
          quantity,
          note,
          date: new Date().toISOString(),
        },
        ...state.transactions,
      ],
    }));
    get().addLog('INFO', `Xuất kho ${quantity} ${product.name}`);

    if (newQty <= 0) {
      get().addLog('ERROR', `Sản phẩm "${product.name}" đã hết hàng`);
    } else if (newQty <= product.threshold) {
      get().addLog('WARNING', `Sản phẩm "${product.name}" sắp hết hàng (còn ${newQty})`);
    }

    return { success: true };
  },

  addLog: (level, message) => {
    set((state) => ({
      logs: [
        { id: String(nextId++), level, message, timestamp: new Date().toISOString() },
        ...state.logs,
      ],
    }));
  },
}));
