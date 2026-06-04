'use client'

import { useEffect, useState } from 'react'
import { ProductionBoard } from '@/components/production/ProductionBoard'
import { ThroughputChart } from '@/components/production/ThroughputChart'

export default function ProductionPage() {
  const [queue, setQueue] = useState<Record<string, any[]>>({
    reflow: [],
    solder: [],
    test: [],
    assembly: [],
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [queueRes, monthlyRes] = await Promise.all([
          fetch('/api/production/queue', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          fetch('/api/reports/monthly', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ])
        if (queueRes.ok) setQueue(await queueRes.json())
        if (monthlyRes.ok) {
          const data = await monthlyRes.json()
          setChartData(data.dailyData || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Production</h1>
        <p className="text-sm text-surface-400 mt-1 font-medium">Workstation queue & throughput</p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-100 p-5 shadow-sm">
        <ProductionBoard
          queue={queue}
          isLoading={isLoading}
          onScan={() => {}}
        />
      </div>

      <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-surface-900">Monthly Throughput</h3>
          <span className="text-[10px] font-mono text-surface-400 bg-surface-50 px-2 py-1 rounded-md">
            units/day
          </span>
        </div>
        {chartData.length > 0 ? (
          <ThroughputChart data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-[300px] text-surface-400 text-sm">
            No production data this month
          </div>
        )}
      </div>
    </div>
  )
}
