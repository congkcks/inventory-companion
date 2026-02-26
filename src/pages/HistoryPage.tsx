import { useInventoryStore } from '@/store/inventoryStore';
import { format } from 'date-fns';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export default function HistoryPage() {
  const transactions = useInventoryStore((s) => s.transactions);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Lịch sử giao dịch</h1>

      <div className="bg-card rounded-lg card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Thời gian</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Loại</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Sản phẩm</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Số lượng</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">
                  {format(new Date(t.date), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-4 py-3">
                  {t.type === 'import' ? (
                    <span className="inline-flex items-center gap-1 text-primary font-medium">
                      <ArrowDownToLine className="h-3.5 w-3.5" /> Nhập
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-success font-medium">
                      <ArrowUpFromLine className="h-3.5 w-3.5" /> Xuất
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-card-foreground">{t.productName}</td>
                <td className="px-4 py-3 text-right font-semibold">{t.quantity}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.note || '—'}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Chưa có giao dịch nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
