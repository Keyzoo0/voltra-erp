'use client'

import { useEffect, useState } from 'react'
import { DashboardStats } from '@/types'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/reports/daily', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        if (res.ok) setStats(await res.json())
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

  const cards = [
    { label: 'Active Orders', value: stats?.activeOrders ?? 0, color: 'bg-blue-500' },
    { label: 'Today Production', value: stats?.totalProduced ?? 0, color: 'bg-green-500' },
    { label: 'Yield Rate', value: stats ? `${stats.yieldRate}%` : '0%', color: 'bg-purple-500' },
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {stats?.date ? `Production summary for ${formatDateShort(stats.date)}` : 'Overview'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${card.color}`} />
              <span className="text-sm text-gray-500">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/orders/create"
              className="block p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <span className="font-medium">+ New Order</span>
              <p className="text-sm text-primary-600 mt-0.5">Buat order produksi baru</p>
            </Link>
            <Link
              href="/inventory"
              className="block p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="font-medium">Check Inventory</span>
              <p className="text-sm text-green-600 mt-0.5">Cek stok komponen & alert</p>
            </Link>
            <Link
              href="/production"
              className="block p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="font-medium">Production Board</span>
              <p className="text-sm text-purple-600 mt-0.5">Lihat queue per workstation</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Today Summary</h3>
            <span className="text-xs text-gray-500">Daily</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">Completed</span>
              <span className="font-semibold text-green-700">{stats?.completed ?? 0} units</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-red-700">Rejected</span>
              <span className="font-semibold text-red-700">{stats?.rejected ?? 0} units</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">Active Orders</span>
              <span className="font-semibold text-blue-700">{stats?.activeOrders ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
