'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Component } from '@/types'

export default function ComponentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [component, setComponent] = useState<Component | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/inventory/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        if (res.ok) setComponent(await res.json())
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-surface-100 rounded" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-surface-50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="flex flex-col items-center py-16">
        <p className="text-surface-500 font-medium">Component not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Inventory
      </button>

      <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-surface-900">{component.partNumber}</h1>
            <p className="text-sm text-surface-400 mt-0.5">{component.description || 'No description'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Stock Qty', value: component.stockQty, color: component.stockQty <= component.minStock ? 'text-red-600' : 'text-surface-900' },
            { label: 'Min Stock', value: component.minStock, color: 'text-surface-900' },
            { label: 'Location', value: component.location || '-', color: 'text-surface-900' },
            { label: 'Supplier', value: component.supplier?.name || '-', color: 'text-surface-900' },
          ].map((item) => (
            <div key={item.label} className="p-4 bg-surface-50 rounded-xl">
              <span className="text-xs text-surface-400 font-medium">{item.label}</span>
              <p className={`text-lg font-bold mt-0.5 ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {component.supplier && (
          <div className="p-4 bg-primary-50/50 rounded-xl">
            <h4 className="text-sm font-medium text-primary-700 mb-2">Supplier Info</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-primary-500 text-xs">Name</span>
                <p className="text-primary-800 font-medium">{component.supplier.name}</p>
              </div>
              <div>
                <span className="text-primary-500 text-xs">Contact</span>
                <p className="text-primary-800 font-medium">{component.supplier.contact || '-'}</p>
              </div>
              <div>
                <span className="text-primary-500 text-xs">Lead Time</span>
                <p className="text-primary-800 font-medium">{component.supplier.leadTime} days</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
