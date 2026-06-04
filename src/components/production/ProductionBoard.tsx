'use client'

import { StationCard } from './StationCard'
import { STATIONS } from '@/lib/utils'
import { useWebSocket } from '@/hooks/useWebSocket'

interface ProductionBoardProps {
  queue: Record<string, any[]>
  onScan: () => void
}

export function ProductionBoard({ queue, onScan }: ProductionBoardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Production Floor</h3>
        <button
          onClick={onScan}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
        >
          + Scan Order
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATIONS.map((station) => (
          <StationCard
            key={station}
            station={station}
            items={queue[station] || []}
          />
        ))}
      </div>
    </div>
  )
}
