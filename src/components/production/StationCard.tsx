'use client'

import { QueueItem } from './QueueItem'
import { cn } from '@/lib/utils'

interface StationCardProps {
  station: string
  items: any[]
}

const STATION_COLORS: Record<string, string> = {
  reflow: 'border-l-red-400',
  solder: 'border-l-yellow-400',
  test: 'border-l-blue-400',
  assembly: 'border-l-green-400',
}

const STATION_LABELS: Record<string, string> = {
  reflow: 'Reflow Oven',
  solder: 'Manual Solder',
  test: 'Testing',
  assembly: 'Assembly',
}

export function StationCard({ station, items }: StationCardProps) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg border-l-4', STATION_COLORS[station])}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">{STATION_LABELS[station] || station}</h4>
          <span className="text-sm text-gray-500">{items.length} jobs</span>
        </div>
      </div>
      <div className="p-3 space-y-2 min-h-[200px]">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-[150px] text-sm text-gray-400">
            Idle
          </div>
        ) : (
          items.map((item, idx) => (
            <QueueItem key={item.id || idx} item={item} />
          ))
        )}
      </div>
    </div>
  )
}
