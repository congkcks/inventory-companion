import { useState } from 'react';
import { useProducts, useCreateProduct } from '@/hooks/useApi';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge: Record<string, string> = {
    'Bình thường': 'bg-success/15 text-success',
    'Sắp hết': 'bg-warning/15 text-warning',
    'Hết hàng': 'bg-destructive/15 text-destructive',
  };

  const handleCreate = () => {
    if (!code.trim() || !name.trim()) {
      toast.error('Vui lòng nhập đầy đủ mã và tên sản phẩm');
      return;
    }
    createProduct.mutate(
      { code: code.trim(), name: name.trim() },
      {
        onSuccess: () => {
          toast.success('Thêm sản phẩm thành công');
          setCode('');
          setName('');
          setOpen(false);
        },
        onError: (err) => {
          toast.error(err.message || 'Thêm sản phẩm thất bại');
        },
      }
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý sản phẩm</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="product-code">Mã sản phẩm</Label>
                <Input
                  id="product-code"
                  placeholder="VD: SP011"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-name">Tên sản phẩm</Label>
                <Input
                  id="product-name"
                  placeholder="VD: Laptop Dell XPS 13"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleCreate}
                disabled={createProduct.isPending}
              >
                {createProduct.isPending ? 'Đang tạo...' : 'Tạo sản phẩm'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
