'use client'

import { StationCard } from './StationCard'
import { STATIONS } from '@/lib/utils'

interface ProductionBoardProps {
  queue: Record<string, any[]>
  isLoading?: boolean
  onScan: () => void
}

export function ProductionBoard({ queue, isLoading, onScan }: ProductionBoardProps) {
  const totalJobs = Object.values(queue).reduce((sum, items) => sum + items.length, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-surface-900">Production Floor</h3>
          <span className="text-xs text-surface-400 bg-surface-50 px-2 py-1 rounded-md font-mono">
            {totalJobs} jobs
          </span>
        </div>
        <button
          onClick={onScan}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-200 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          </svg>
          Scan Order
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATIONS.map((s) => (
            <div key={s} className="bg-surface-50 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATIONS.map((station) => (
            <StationCard
              key={station}
              station={station}
              items={queue[station] || []}
            />
          ))}
        </div>
      )}
    </div>
  )
}
