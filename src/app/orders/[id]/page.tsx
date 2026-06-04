'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Order } from '@/types'
import { OrderDetail } from '@/components/orders/OrderDetail'
import { useAuthStore } from '@/stores/authStore'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        if (res.ok) setOrder(await res.json())
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  const handleStatusUpdate = async (status: string, notes?: string) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status, notes }),
    })
    if (res.ok) {
      setOrder(await res.json())
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-24 bg-surface-100 rounded" />
        <div className="h-8 w-48 bg-surface-100 rounded" />
        <div className="h-64 bg-surface-50 rounded-2xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg className="w-12 h-12 text-surface-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-surface-500 font-medium">Order not found</p>
        <button onClick={() => router.back()} className="text-primary-600 text-sm mt-2 hover:text-primary-700">Kembali</button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Orders
      </button>

      <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-sm">
        <OrderDetail
          order={order}
          onStatusUpdate={handleStatusUpdate}
          userRole={user?.role}
        />
      </div>
    </div>
  )
}
