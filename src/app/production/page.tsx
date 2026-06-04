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
        <h1 className="text-2xl font-bold text-gray-900">Production</h1>
        <p className="text-sm text-gray-500 mt-1">Workstation queue & throughput</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductionBoard
          queue={queue}
          onScan={() => {}}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Monthly Throughput</h3>
        {chartData.length > 0 ? (
          <ThroughputChart data={chartData} />
        ) : (
          <p className="text-gray-500 text-sm">No production data this month</p>
        )}
      </div>
    </div>
  )
}
