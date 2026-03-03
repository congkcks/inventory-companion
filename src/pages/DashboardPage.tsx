import { useProducts, useTransactions } from '@/hooks/useApi';
import { StatCard } from '@/components/StatCard';
import { Package, Layers, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: transactions = [], isLoading: loadingTx } = useTransactions();

  const totalProducts = products.length;
  const totalStock = products.reduce((a, p) => a + p.stock, 0);
  const lowStockCount = products.filter(
    (p) => p.status === 'Sắp hết' || p.status === 'Hết hàng'
  ).length;

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTransactions = transactions.filter(
    (t) => t.time.startsWith(today)
  ).length;

  const lowStockProducts = [...products]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  // Build chart data from real transactions
  const chartData = (() => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const map: Record<string, { import: number; export: number }> = {};
    days.forEach((d) => (map[d] = { import: 0, export: 0 }));
    transactions.forEach((t) => {
      const dayIndex = new Date(t.time).getDay();
      const dayLabel = days[dayIndex];
      if (t.type === 1) map[dayLabel].import += t.quantity;
      else if (t.type === 2) map[dayLabel].export += t.quantity;
    });
    return ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => ({
      day,
      import: map[day].import,
      export: map[day].export,
    }));
  })();

  if (loadingProducts || loadingTx) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng sản phẩm" value={totalProducts} icon={<Package className="h-5 w-5" />} />
        <StatCard title="Tổng tồn kho" value={totalStock} icon={<Layers className="h-5 w-5" />} />
        <StatCard title="Sắp hết hàng" value={lowStockCount} variant={lowStockCount > 0 ? 'warning' : 'default'} icon={<AlertTriangle className="h-5 w-5" />} />
        <StatCard title="Giao dịch hôm nay" value={todayTransactions} icon={<ArrowRightLeft className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg card-shadow p-5">
          <h2 className="text-base font-semibold text-card-foreground mb-4">Nhập / Xuất theo ngày</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="import" name="Nhập kho" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="export" name="Xuất kho" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg card-shadow p-5">
          <h2 className="text-base font-semibold text-card-foreground mb-4">Tồn kho thấp nhất</h2>
          <div className="space-y-3">
            {lowStockProducts.map((p) => {
              const barColor =
                p.status === 'Hết hàng' ? 'bg-destructive' :
                p.status === 'Sắp hết' ? 'bg-warning' : 'bg-success';
              const barWidth = p.stock === 0 ? 4 : Math.max(8, Math.min((p.stock / 50) * 100, 100));

              return (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-card-foreground font-medium truncate">{p.name}</span>
                    <span className="text-muted-foreground shrink-0 ml-2">{p.stock}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${barWidth}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
