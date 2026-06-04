'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Order } from '@/types'
import { OrderList } from '@/components/orders/OrderList'
import { Button } from '@/components/common/Button'
import { SearchInput } from '@/components/common/SearchInput'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.set('client', search)
        const res = await fetch(`/api/orders?${params}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        if (res.ok) setOrders(await res.json())
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [search])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Orders</h1>
          <p className="text-sm text-surface-400 mt-1 font-medium">Manage production orders</p>
        </div>
        <Button variant="gradient" onClick={() => router.push('/orders/create')}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Order
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-72">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by client..."
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <span className="w-2 h-2 rounded-full bg-surface-300" />
            {orders.length} orders
          </div>
        </div>
        <OrderList
          orders={orders}
          isLoading={isLoading}
          onSelect={(order) => router.push(`/orders/${order.id}`)}
        />
      </div>
    </div>
  )
}
