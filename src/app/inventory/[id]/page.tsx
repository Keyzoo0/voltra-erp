'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Component } from '@/types'
import { formatCurrency } from '@/lib/utils'

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!component) {
    return <div className="text-center py-12 text-gray-500">Component not found</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to Inventory
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{component.partNumber}</h1>
          <p className="text-gray-500 mt-1">{component.description || 'No description'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500">Stock Qty</span>
            <p className={`text-2xl font-bold ${component.stockQty <= component.minStock ? 'text-red-600' : 'text-gray-900'}`}>
              {component.stockQty}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500">Min Stock</span>
            <p className="text-2xl font-bold text-gray-900">{component.minStock}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500">Location</span>
            <p className="text-lg font-medium text-gray-900">{component.location || '-'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500">Supplier</span>
            <p className="text-lg font-medium text-gray-900">{component.supplier?.name || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
