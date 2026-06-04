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
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-100 rounded" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-48 bg-surface-50 rounded-2xl" />
          <div className="h-48 bg-surface-50 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Reports</h1>
        <p className="text-sm text-surface-400 mt-1 font-medium">Production analytics & summary</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-surface-900">Daily Summary</h3>
            <span className="text-[10px] font-mono text-surface-400 bg-surface-50 px-2 py-1 rounded-md">{daily?.date || '-'}</span>
          </div>
          {daily ? (
            <div className="space-y-3">
              {[
                { label: 'Completed', value: daily.completed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Rejected', value: daily.rejected, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Yield Rate', value: `${daily.yieldRate}%`, color: 'text-primary-600', bg: 'bg-primary-50' },
              ].map((item) => (
                <div key={item.label} className={`flex justify-between items-center p-3.5 ${item.bg} rounded-xl`}>
                  <span className="text-sm font-medium text-surface-600">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-surface-400 text-sm text-center py-8">No daily data available</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-surface-900">Monthly Report</h3>
            <span className="text-[10px] font-mono text-surface-400 bg-surface-50 px-2 py-1 rounded-md">{report?.month || '-'}</span>
          </div>
          {report ? (
            <div className="space-y-3">
              {[
                { label: 'Total Produced', value: `${report.totalProduced} units`, color: 'text-surface-900' },
                { label: 'Yield Rate', value: `${report.yieldRate}%`, color: 'text-emerald-600' },
                { label: 'Orders This Month', value: report.ordersThisMonth, color: 'text-primary-600' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3.5 bg-surface-50 rounded-xl">
                  <span className="text-sm font-medium text-surface-500">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-surface-400 text-sm text-center py-8">No monthly data available</p>
          )}
        </div>
      </div>

      {report?.ordersByStatus && (
        <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-sm">
          <h3 className="font-semibold text-surface-900 mb-5">Orders by Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {report.ordersByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between p-3.5 bg-surface-50 rounded-xl">
                <StatusBadge status={item.status} />
                <span className="text-sm font-bold text-surface-700">{item._count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-surface-900">Export Reports</h3>
          <svg className="w-5 h-5 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </div>
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
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m0 0l-3-3m3 3l3-3m2 8.25h-10a2 2 0 01-2-2V5.25a2 2 0 012-2h4l6 6v9a2 2 0 01-2 2z" />
          </svg>
          Export CSV (All Orders)
        </Button>
      </div>
    </div>
  )
}
