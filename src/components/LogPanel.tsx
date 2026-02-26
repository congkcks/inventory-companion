import { useState } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { ChevronDown, ChevronUp, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';

export function LogPanel() {
  const [expanded, setExpanded] = useState(false);
  const logs = useInventoryStore((s) => s.logs);
  const displayLogs = expanded ? logs.slice(0, 20) : logs.slice(0, 3);

  const levelColors: Record<string, string> = {
    INFO: 'text-log-info',
    WARNING: 'text-log-warning',
    ERROR: 'text-log-error',
  };

  const levelBg: Record<string, string> = {
    INFO: 'bg-log-info/10',
    WARNING: 'bg-log-warning/10',
    ERROR: 'bg-log-error/10',
  };

  const handleDownload = () => {
    const content = logs
      .map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border-t border-border bg-card">
      <div className="flex items-center justify-between px-6 py-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          Log hệ thống ({logs.length})
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            {expanded ? 'Thu gọn' : 'Xem log chi tiết'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Tải file log
          </button>
        </div>
      </div>

      <div className={`px-6 pb-3 space-y-1 transition-all ${expanded ? 'max-h-80 overflow-y-auto' : 'max-h-32 overflow-hidden'}`}>
        {displayLogs.map((log) => (
          <div
            key={log.id}
            className={`flex items-start gap-3 px-3 py-1.5 rounded text-xs font-mono ${levelBg[log.level]}`}
          >
            <span className={`font-bold shrink-0 w-16 ${levelColors[log.level]}`}>{log.level}</span>
            <span className="text-muted-foreground shrink-0">
              {format(new Date(log.timestamp), 'HH:mm:ss')}
            </span>
            <span className="text-foreground">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
