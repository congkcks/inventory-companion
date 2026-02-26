import { useState } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { getProductStatus, getStatusLabel } from '@/types/inventory';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: '', name: '', quantity: 0, threshold: 5 });
  const { toast } = useToast();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = {
    normal: 'bg-success/15 text-success',
    low: 'bg-warning/15 text-warning',
    out: 'bg-destructive/15 text-destructive',
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ code: '', name: '', quantity: 0, threshold: 5 });
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setEditId(id);
    setForm({ code: p.code, name: p.name, quantity: p.quantity, threshold: p.threshold });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.code || !form.name) {
      toast({ title: 'Lỗi', description: 'Vui lòng điền đầy đủ thông tin', variant: 'destructive' });
      return;
    }
    if (editId) {
      updateProduct(editId, form);
      toast({ title: 'Thành công', description: 'Đã cập nhật sản phẩm' });
    } else {
      addProduct(form);
      toast({ title: 'Thành công', description: 'Đã thêm sản phẩm mới' });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast({ title: 'Đã xóa', description: 'Sản phẩm đã được xóa khỏi hệ thống' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý sản phẩm</h1>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
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
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Ngưỡng</th>
              <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Trạng thái</th>
              <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const status = getProductStatus(p);
              return (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-muted-foreground">{p.code}</td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-right font-semibold">{p.quantity}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{p.threshold}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge[status]}`}>
                      {getStatusLabel(status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEdit(p.id)}
                        className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground">Mã sản phẩm</label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="VD: SP009" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Tên sản phẩm</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tên sản phẩm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Số lượng</label>
                <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Ngưỡng cảnh báo</label>
                <Input type="number" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })} />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">
              {editId ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
