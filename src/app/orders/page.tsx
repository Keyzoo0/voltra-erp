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
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage production orders</p>
        </div>
        <Button onClick={() => router.push('/orders/create')}>+ New Order</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by client..."
          />
        </div>
      </div>

      <OrderList
        orders={orders}
        isLoading={isLoading}
        onSelect={(order) => router.push(`/orders/${order.id}`)}
      />
    </div>
  )
}
