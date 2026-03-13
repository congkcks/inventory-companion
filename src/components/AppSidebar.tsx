import { NavLink } from '@/components/NavLink';
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Settings,
  Warehouse,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Quản lý sản phẩm' },
  { to: '/import', icon: ArrowDownToLine, label: 'Nhập kho' },
  { to: '/export', icon: ArrowUpFromLine, label: 'Xuất kho' },
  { to: '/history', icon: History, label: 'Lịch sử giao dịch' },
  { to: '/settings', icon: Settings, label: 'Cài đặt' },
];

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <Warehouse className="h-7 w-7 text-sidebar-primary" />
        <span className="text-lg font-bold tracking-tight">KhoViet</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50"><p className="text-xs text-sidebar-foreground/50">© 2026 KhoUTC v1.0</p></p>
      </div>
    </aside>
  );
}
