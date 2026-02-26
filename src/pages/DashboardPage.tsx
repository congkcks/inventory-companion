import { useInventoryStore } from '@/store/inventoryStore';
import { getProductStatus } from '@/types/inventory';
import { StatCard } from '@/components/StatCard';
import { Package, Layers, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { day: 'T2', import: 15, export: 8 },
  { day: 'T3', import: 22, export: 12 },
  { day: 'T4', import: 8, export: 18 },
  { day: 'T5', import: 30, export: 10 },
  { day: 'T6', import: 12, export: 25 },
  { day: 'T7', import: 5, export: 3 },
  { day: 'CN', import: 0, export: 0 },
];

export default function DashboardPage() {
  const products = useInventoryStore((s) => s.products);
  const transactions = useInventoryStore((s) => s.transactions);

  const totalProducts = products.length;
  const totalStock = products.reduce((a, p) => a + p.quantity, 0);
  const lowStockCount = products.filter(
    (p) => getProductStatus(p) === 'low' || getProductStatus(p) === 'out'
  ).length;
  const todayTransactions = transactions.filter(
    (t) => t.date.startsWith('2026-02-26')
  ).length;

  const lowStockProducts = [...products]
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng sản phẩm"
          value={totalProducts}
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          title="Tổng tồn kho"
          value={totalStock}
          icon={<Layers className="h-5 w-5" />}
        />
        <StatCard
          title="Sắp hết hàng"
          value={lowStockCount}
          variant={lowStockCount > 0 ? 'warning' : 'default'}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          title="Giao dịch hôm nay"
          value={todayTransactions}
          icon={<ArrowRightLeft className="h-5 w-5" />}
        />
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
              const status = getProductStatus(p);
              const barColor =
                status === 'out'
                  ? 'bg-destructive'
                  : status === 'low'
                  ? 'bg-warning'
                  : 'bg-success';
              const barWidth = p.quantity === 0 ? 4 : Math.max(8, (p.quantity / (p.threshold * 2)) * 100);

              return (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-card-foreground font-medium truncate">{p.name}</span>
                    <span className="text-muted-foreground shrink-0 ml-2">{p.quantity}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${Math.min(barWidth, 100)}%` }}
                    />
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
