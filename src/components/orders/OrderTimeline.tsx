'use client'

import { StatusLog } from '@/types'
import { formatDate, STATUS_COLORS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface OrderTimelineProps {
  logs: StatusLog[]
}

export function OrderTimeline({ logs }: OrderTimelineProps) {
  if (logs.length === 0) {
    return <p className="text-gray-500 text-sm">Belum ada riwayat status</p>
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {logs.map((log, idx) => (
          <li key={log.id}>
            <div className="relative pb-8">
              {idx !== logs.length - 1 && (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
              )}
              <div className="relative flex gap-3">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white text-xs font-bold',
                    STATUS_COLORS[log.toStatus] || 'bg-gray-100'
                  )}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {log.fromStatus || '-'} → {log.toStatus}
                  </div>
                  <div className="text-xs text-gray-500">
                    {log.user?.name || 'System'} · {formatDate(log.createdAt)}
                  </div>
                  {log.notes && (
                    <p className="text-sm text-gray-600 mt-1">{log.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
