import { useState } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

interface StockFormProps {
  type: 'import' | 'export';
}

export default function StockPage({ type }: StockFormProps) {
  const { products, importStock, exportStock } = useInventoryStore();
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const { toast } = useToast();

  const isImport = type === 'import';
  const title = isImport ? 'Nhập kho' : 'Xuất kho';
  const Icon = isImport ? ArrowDownToLine : ArrowUpFromLine;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!productId || qty <= 0) {
      toast({ title: 'Lỗi', description: 'Vui lòng chọn sản phẩm và nhập số lượng hợp lệ', variant: 'destructive' });
      return;
    }

    if (isImport) {
      importStock(productId, qty, note);
      toast({ title: 'Thành công', description: `Đã nhập ${qty} sản phẩm vào kho` });
    } else {
      const result = exportStock(productId, qty, note);
      if (!result.success) {
        setErrorModal(result.error || 'Lỗi không xác định');
        return;
      }
      toast({ title: 'Thành công', description: `Đã xuất ${qty} sản phẩm khỏi kho` });
    }

    setProductId('');
    setQuantity('');
    setNote('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        {title}
      </h1>

      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="bg-card rounded-lg card-shadow p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Chọn sản phẩm</label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="-- Chọn sản phẩm --" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.code} - {p.name} (Tồn: {p.quantity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Số lượng</label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Nhập số lượng"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Ghi chú</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú (tùy chọn)"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full gap-2">
            <Icon className="h-4 w-4" />
            Xác nhận {title.toLowerCase()}
          </Button>
        </form>
      </div>

      <Dialog open={!!errorModal} onOpenChange={() => setErrorModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              ⚠️ Lỗi xuất kho
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-foreground">{errorModal}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Vui lòng kiểm tra lại số lượng tồn kho trước khi thực hiện xuất.
            </p>
          </div>
          <Button variant="destructive" onClick={() => setErrorModal(null)} className="w-full">
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
