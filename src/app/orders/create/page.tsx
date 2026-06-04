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
        <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
        <p className="text-sm text-gray-500 mt-1">Buat order produksi baru</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <OrderForm
          onSubmit={handleSubmit}
          boms={boms}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  )
}
