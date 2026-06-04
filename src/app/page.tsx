'use client'

import { useEffect, useState } from 'react'
import { DashboardStats } from '@/types'
import { formatDateShort } from '@/lib/utils'
import Link from 'next/link'

const STAT_CARDS = [
  {
    label: 'Active Orders',
    getValue: (s: DashboardStats) => s.activeOrders,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Today Production',
    getValue: (s: DashboardStats) => s.totalProduced,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-emerald-600',
    light: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Yield Rate',
    getValue: (s: DashboardStats) => `${s.yieldRate}%`,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    gradient: 'from-violet-500 to-violet-600',
    light: 'bg-violet-50 text-violet-600',
  },
  {
    label: 'Total Orders',
    getValue: (s: DashboardStats) => s.totalOrders,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
    gradient: 'from-amber-500 to-amber-600',
    light: 'bg-amber-50 text-amber-600',
  },
]

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-surface-400 mt-1 font-medium">
            {stats?.date ? `Production summary for ${formatDateShort(stats.date)}` : 'Overview'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-surface-200 rounded-xl text-xs text-surface-500 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-surface-100 p-6 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-100 rounded-xl" />
                <div className="h-4 w-24 bg-surface-100 rounded" />
              </div>
              <div className="h-8 w-16 bg-surface-100 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, i) => (
            <div
              key={card.label}
              className="group bg-white rounded-2xl border border-surface-100 p-6 hover:shadow-xl hover:border-surface-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${card.light} rounded-xl flex items-center justify-center`}>
                  {card.icon}
                </div>
                <span className="text-[10px] font-semibold text-surface-300 uppercase tracking-wider">
                  {card.label === 'Active Orders' ? 'In Progress' : card.label === 'Yield Rate' ? 'Efficiency' : ''}
                </span>
              </div>
              <p className="text-3xl font-bold text-surface-900 mt-3 tracking-tight">
                {card.getValue(stats!)}
              </p>
              <p className="text-xs text-surface-400 mt-1 font-medium">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-surface-900">Quick Actions</h3>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-surface-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-surface-200" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href="/orders/create"
              className="group relative overflow-hidden p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl text-white hover:shadow-lg hover:shadow-primary-200 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <svg className="w-7 h-7 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <p className="font-semibold text-sm">New Order</p>
                <p className="text-xs text-primary-100 mt-0.5">Buat order produksi</p>
              </div>
            </Link>
            <Link
              href="/inventory"
              className="group relative overflow-hidden p-4 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl text-white hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <svg className="w-7 h-7 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <p className="font-semibold text-sm">Inventory</p>
                <p className="text-xs text-emerald-100 mt-0.5">Cek stok & alert</p>
              </div>
            </Link>
            <Link
              href="/production"
              className="group relative overflow-hidden p-4 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl text-white hover:shadow-lg hover:shadow-violet-200 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <svg className="w-7 h-7 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
                <p className="font-semibold text-sm">Production</p>
                <p className="text-xs text-violet-100 mt-0.5">Lihat queue produksi</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-surface-900">Today Summary</h3>
            <span className="text-[10px] font-mono text-surface-400 bg-surface-50 px-2 py-1 rounded-md">Daily</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Completed', value: stats?.completed ?? 0, bg: 'bg-emerald-50', bgIcon: 'bg-emerald-100', text: 'text-emerald-700', textValue: 'text-emerald-600', hover: 'hover:bg-emerald-100/50', icon: '✓' },
              { label: 'Rejected', value: stats?.rejected ?? 0, bg: 'bg-red-50', bgIcon: 'bg-red-100', text: 'text-red-700', textValue: 'text-red-600', hover: 'hover:bg-red-100/50', icon: '✗' },
              { label: 'Active Orders', value: stats?.activeOrders ?? 0, bg: 'bg-blue-50', bgIcon: 'bg-blue-100', text: 'text-blue-700', textValue: 'text-blue-600', hover: 'hover:bg-blue-100/50', icon: '●' },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between p-3.5 ${item.bg} rounded-xl ${item.hover} transition-colors`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-7 h-7 rounded-lg ${item.bgIcon} flex items-center justify-center text-xs font-bold ${item.textValue}`}>
                    {item.icon}
                  </span>
                  <span className={`text-sm font-medium ${item.text}`}>{item.label}</span>
                </div>
                <span className={`font-bold ${item.textValue}`}>
                  {item.value}{item.label === 'Completed' || item.label === 'Rejected' ? ' units' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
