'use client'

import { formatDateShort } from '@/lib/utils'

interface QueueItemProps {
  item: any
}

export function QueueItem({ item }: QueueItemProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 cursor-pointer transition-colors">
      <div className="font-medium text-gray-900 truncate">
        {item.orderItem?.bom?.pcbName || 'Unknown PCB'}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500">
          #{item.orderItem?.orderId?.slice(0, 6) || '-'}
        </span>
        <span className="text-xs text-gray-500">
          {item.startedAt ? formatDateShort(item.startedAt) : '-'}
        </span>
      </div>
    </div>
  )
}
