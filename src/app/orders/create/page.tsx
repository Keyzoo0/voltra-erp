'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderForm } from '@/components/orders/OrderForm'

export default function CreateOrderPage() {
  const router = useRouter()
  const [boms, setBoms] = useState<{ id: string; pcbName: string }[]>([])

  useEffect(() => {
    fetch('/api/boms', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then(setBoms)
      .catch(console.error)
  }, [])

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      router.push('/orders')
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-600 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Create Order</h1>
        <p className="text-sm text-surface-400 mt-1 font-medium">Buat order produksi baru</p>
      </div>
      <div className="bg-white rounded-2xl border border-surface-100 p-6 shadow-sm">
        <OrderForm
          onSubmit={handleSubmit}
          boms={boms}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  )
}
