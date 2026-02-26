import { ReactNode } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { LogPanel } from '@/components/LogPanel';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6">{children}</main>
        <LogPanel />
      </div>
    </div>
  );
}
