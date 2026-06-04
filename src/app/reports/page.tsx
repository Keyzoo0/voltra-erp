'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/common/StatusBadge'

interface MonthlyReport {
  month: string
  completed: number
  rejected: number
  totalProduced: number
  yieldRate: number
  ordersThisMonth: number
  ordersByStatus: { status: string; _count: number }[]
}

export default function ReportsPage() {
  const [report, setReport] = useState<MonthlyReport | null>(null)
  const [daily, setDaily] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        const [monthlyRes, dailyRes] = await Promise.all([
          fetch('/api/reports/monthly', { headers }),
          fetch('/api/reports/daily', { headers }),
        ])
        if (monthlyRes.ok) setReport(await monthlyRes.json())
        if (dailyRes.ok) setDaily(await dailyRes.json())
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Production analytics & summary</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Daily Summary</h3>
          {daily ? (
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-medium text-green-600">{daily.completed}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Rejected</span>
                <span className="font-medium text-red-600">{daily.rejected}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Yield Rate</span>
                <span className="font-medium">{daily.yieldRate}%</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No data</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Report</h3>
          {report ? (
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Produced</span>
                <span className="font-medium">{report.totalProduced} units</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Yield Rate</span>
                <span className="font-medium">{report.yieldRate}%</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Orders This Month</span>
                <span className="font-medium">{report.ordersThisMonth}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No data</p>
          )}
        </div>
      </div>

      {report && report.ordersByStatus && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {report.ordersByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <StatusBadge status={item.status} />
                <span className="text-sm font-medium">{item._count} orders</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Export Reports</h3>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={async () => {
              const res = await fetch('/api/reports/export', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ type: 'csv', month: 'all' }),
              })
              if (res.ok) {
                const data = await res.json()
                const blob = new Blob([data.content], { type: data.contentType })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = data.filename
                a.click()
                URL.revokeObjectURL(url)
              }
            }}
          >
            Export CSV (All Orders)
          </Button>
        </div>
      </div>
    </div>
  )
}
