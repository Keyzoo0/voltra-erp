'use client'

import { DataTable } from '@/components/common/DataTable'
import { Component } from '@/types'

interface StockTableProps {
  components: Component[]
  isLoading: boolean
  onSelect?: (component: Component) => void
  onAdjust?: (component: Component) => void
}

export function StockTable({ components, isLoading, onSelect }: StockTableProps) {
  const columns = [
    { key: 'partNumber', header: 'Part Number', sortable: true },
    { key: 'description', header: 'Description', sortable: true, render: (c: Component) => c.description || '-' },
    {
      key: 'stockQty',
      header: 'Stock',
      sortable: true,
      render: (c: Component) => (
        <span className={c.stockQty <= c.minStock ? 'text-red-600 font-medium' : ''}>
          {c.stockQty}
        </span>
      ),
    },
    { key: 'minStock', header: 'Min Stock', sortable: true },
    { key: 'location', header: 'Location', render: (c: Component) => c.location || '-' },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (c: Component) => c.supplier?.name || '-',
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={components}
      isLoading={isLoading}
      onRowClick={onSelect}
    />
  )
}
