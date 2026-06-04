'use client'

import { formatDateShort } from '@/lib/utils'

interface QueueItemProps {
  item: any
}

export function QueueItem({ item }: QueueItemProps) {
  return (
    <div className="p-3 bg-white rounded-xl text-sm border border-surface-100 hover:border-surface-200 hover:shadow-sm cursor-pointer transition-all duration-150">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-surface-900 truncate">
            {item.orderItem?.bom?.pcbName || 'Unknown PCB'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-surface-400">
              #{item.orderItem?.orderId?.slice(0, 6) || '-'}
            </span>
            <span className="w-1 h-1 rounded-full bg-surface-300" />
            <span className="text-[10px] text-surface-400 font-medium">
              {item.operator?.name || 'Unassigned'}
            </span>
          </div>
        </div>
        <span className="text-[10px] text-surface-400 whitespace-nowrap ml-3">
          {item.startedAt ? formatDateShort(item.startedAt) : '-'}
        </span>
      </div>
    </div>
  )
}
