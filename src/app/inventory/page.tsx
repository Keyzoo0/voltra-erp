'use client'

import { useEffect, useState } from 'react'
import { Component } from '@/types'
import { StockTable } from '@/components/inventory/StockTable'
import { LowStockAlert } from '@/components/inventory/LowStockAlert'
import { SearchInput } from '@/components/common/SearchInput'

export default function InventoryPage() {
  const [components, setComponents] = useState<Component[]>([])
  const [lowStock, setLowStock] = useState<Component[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        const [compRes, alertRes] = await Promise.all([
          fetch(`/api/inventory?${params}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          fetch('/api/inventory/alerts', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ])
        if (compRes.ok) setComponents(await compRes.json())
        if (alertRes.ok) setLowStock(await alertRes.json())
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
      <div>
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Inventory</h1>
        <p className="text-sm text-surface-400 mt-1 font-medium">Manage components & stock levels</p>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-white rounded-2xl border border-red-200/80 shadow-sm overflow-hidden">
          <LowStockAlert components={lowStock} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-surface-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-surface-900">All Components</h3>
          <div className="w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search part number..."
            />
          </div>
        </div>
        <StockTable
          components={components}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
