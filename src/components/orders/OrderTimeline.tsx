'use client'

import { StatusLog } from '@/types'
import { formatDate, STATUS_COLORS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface OrderTimelineProps {
  logs: StatusLog[]
}

export function OrderTimeline({ logs }: OrderTimelineProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-surface-400">
        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs font-medium">Belum ada riwayat status</p>
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {logs.map((log, idx) => (
          <li key={log.id}>
            <div className="relative pb-8">
              {idx !== logs.length - 1 && (
                <span className="absolute left-[15px] top-6 -ml-px h-full w-0.5 bg-surface-200" />
              )}
              <div className="relative flex gap-4">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white text-[10px] font-bold flex-shrink-0',
                  STATUS_COLORS[log.toStatus] || 'bg-surface-100 text-surface-500'
                )}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-surface-900">
                      {log.fromStatus || '—'}
                    </span>
                    <svg className="w-3.5 h-3.5 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    <span className="text-sm font-semibold text-surface-900">
                      {log.toStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-surface-400 font-medium">
                      {log.user?.name || 'System'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-surface-300" />
                    <span className="text-[11px] text-surface-400">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-surface-500 mt-1.5 bg-surface-50 px-2.5 py-1.5 rounded-lg">
                      {log.notes}
                    </p>
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
