import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'default' | 'warning' | 'danger';
}

export function StatCard({ title, value, icon, variant = 'default' }: StatCardProps) {
  const borderColors = {
    default: 'border-l-primary',
    warning: 'border-l-warning',
    danger: 'border-l-destructive',
  };

  const iconBg = {
    default: 'bg-primary/10 text-primary',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className={`bg-card rounded-lg card-shadow p-5 border-l-4 ${borderColors[variant]} animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{value}</p>
        </div>
        <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${iconBg[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
