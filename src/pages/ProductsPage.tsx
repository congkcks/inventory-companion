import { useState } from 'react';
import { useProducts } from '@/hooks/useApi';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge: Record<string, string> = {
    'Bình thường': 'bg-success/15 text-success',
    'Sắp hết': 'bg-warning/15 text-warning',
    'Hết hàng': 'bg-destructive/15 text-destructive',
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý sản phẩm</h1>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-card rounded-lg card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Mã SP</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Tên sản phẩm</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Tồn kho</th>
              <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-muted-foreground">{p.code}</td>
                <td className="px-4 py-3 font-medium text-card-foreground">{p.name}</td>
                <td className="px-4 py-3 text-right font-semibold">{p.stock}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge[p.status] || ''}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
