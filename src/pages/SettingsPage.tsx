import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        Cài đặt
      </h1>

      <div className="bg-card rounded-lg card-shadow p-6 max-w-lg">
        <h2 className="text-base font-semibold text-card-foreground mb-4">Thông tin hệ thống</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Phiên bản</span>
            <span className="font-medium text-card-foreground">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Tên hệ thống</span>
            <span className="font-medium text-card-foreground">KhoViet</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Ngày triển khai</span>
            <span className="font-medium text-card-foreground">26/02/2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
