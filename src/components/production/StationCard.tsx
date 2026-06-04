'use client'

import { QueueItem } from './QueueItem'
import { cn } from '@/lib/utils'

interface StationCardProps {
  station: string
  items: any[]
}

const STATION_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  reflow:   { label: 'Reflow Oven',   color: 'border-l-red-400',     icon: '🔥' },
  solder:   { label: 'Manual Solder', color: 'border-l-amber-400',   icon: '🔧' },
  test:     { label: 'Testing',       color: 'border-l-blue-400',    icon: '🔍' },
  assembly: { label: 'Assembly',      color: 'border-l-emerald-400', icon: '📐' },
}

export function StationCard({ station, items }: StationCardProps) {
  const config = STATION_CONFIG[station] || { label: station, color: 'border-l-gray-400', icon: '⚙' }

  return (
    <div className={cn(
      'bg-white border border-surface-200 rounded-2xl border-l-4 overflow-hidden hover:shadow-lg transition-all duration-200',
      config.color
    )}>
      <div className="p-4 border-b border-surface-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <h4 className="font-semibold text-surface-900 text-sm">{config.label}</h4>
          </div>
          <span className={cn(
            'text-xs font-bold px-2 py-0.5 rounded-md',
            items.length === 0 ? 'bg-surface-100 text-surface-400' : 'bg-primary-50 text-primary-600'
          )}>
            {items.length > 0 ? `${items.length} job${items.length > 1 ? 's' : ''}` : 'Idle'}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-2 min-h-[180px] bg-surface-50/30">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[150px] text-xs text-surface-300">
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12" />
            </svg>
            No active jobs
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
