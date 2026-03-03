import { ApiProduct, ApiTransaction, ApiLog } from './api';

export const mockProducts: ApiProduct[] = [
  { id: 'mock-1', code: 'SP001', name: 'Laptop Dell', stock: 120, status: 'Bình thường' },
  { id: 'mock-2', code: 'SP002', name: 'Chuột Logitech', stock: 85, status: 'Bình thường' },
  { id: 'mock-3', code: 'SP003', name: 'Bàn phím cơ', stock: 8, status: 'Sắp hết' },
  { id: 'mock-4', code: 'SP004', name: 'Màn hình LG', stock: 0, status: 'Hết hàng' },
  { id: 'mock-5', code: 'SP005', name: 'Tai nghe Sony', stock: 45, status: 'Bình thường' },
  { id: 'mock-6', code: 'SP006', name: 'Ổ cứng SSD', stock: 3, status: 'Sắp hết' },
  { id: 'mock-7', code: 'SP007', name: 'RAM 16GB', stock: 60, status: 'Bình thường' },
  { id: 'mock-8', code: 'SP008', name: 'USB 64GB', stock: 200, status: 'Bình thường' },
  { id: 'mock-9', code: 'SP009', name: 'Webcam HD', stock: 0, status: 'Hết hàng' },
  { id: 'mock-10', code: 'SP010', name: 'Loa Bluetooth', stock: 15, status: 'Bình thường' },
];

const now = new Date();
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000).toISOString();

export const mockTransactions: ApiTransaction[] = [
  { id: 'tx-1', time: h(1), type: 1, productID: 'mock-1', quantity: 50, note: 'Nhập hàng từ NCC', product: null },
  { id: 'tx-2', time: h(2), type: 2, productID: 'mock-2', quantity: 15, note: 'Xuất cho đại lý A', product: null },
  { id: 'tx-3', time: h(5), type: 1, productID: 'mock-5', quantity: 30, note: 'Nhập bổ sung', product: null },
  { id: 'tx-4', time: h(8), type: 2, productID: 'mock-3', quantity: 20, note: 'Xuất kho đợt 2', product: null },
  { id: 'tx-5', time: h(24), type: 1, productID: 'mock-7', quantity: 60, note: 'Nhập hàng mới', product: null },
  { id: 'tx-6', time: h(26), type: 2, productID: 'mock-6', quantity: 7, note: 'Xuất cho KH online', product: null },
  { id: 'tx-7', time: h(48), type: 1, productID: 'mock-8', quantity: 200, note: 'Nhập lô lớn', product: null },
  { id: 'tx-8', time: h(50), type: 2, productID: 'mock-10', quantity: 5, note: 'Xuất mẫu thử', product: null },
];

export const mockLogs: ApiLog[] = [
  { id: 'log-1', time: h(0.1), level: 'INFO', message: 'Hệ thống khởi động thành công' },
  { id: 'log-2', time: h(1), level: 'INFO', message: 'Nhập kho 50 Laptop Dell' },
  { id: 'log-3', time: h(2), level: 'INFO', message: 'Xuất kho 15 Chuột Logitech' },
  { id: 'log-4', time: h(3), level: 'WARNING', message: 'Sản phẩm "Bàn phím cơ" sắp hết hàng (còn 8)' },
  { id: 'log-5', time: h(5), level: 'ERROR', message: 'Xuất kho thất bại: số lượng vượt tồn kho (Webcam HD)' },
  { id: 'log-6', time: h(8), level: 'INFO', message: 'Xuất kho 20 Bàn phím cơ' },
  { id: 'log-7', time: h(24), level: 'WARNING', message: 'Sản phẩm "Màn hình LG" đã hết hàng' },
  { id: 'log-8', time: h(48), level: 'INFO', message: 'Nhập kho 200 USB 64GB' },
];
