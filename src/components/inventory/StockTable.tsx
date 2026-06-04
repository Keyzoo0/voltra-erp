'use client'

import { DataTable } from '@/components/common/DataTable'
import { Component } from '@/types'

interface StockTableProps {
  components: Component[]
  isLoading: boolean
  onSelect?: (component: Component) => void
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; dot: string }> = {
  critical: { label: 'Critical', bg: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  low: { label: 'Low', bg: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
  ok: { label: 'OK', bg: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
}

function stockStatus(c: Component) {
  const ratio = c.stockQty / Math.max(c.minStock, 1)
  if (c.stockQty === 0) return STATUS_CONFIG.critical
  if (ratio <= 0.5) return STATUS_CONFIG.critical
  if (ratio <= 1) return STATUS_CONFIG.low
  return STATUS_CONFIG.ok
}

export function StockTable({ components, isLoading, onSelect }: StockTableProps) {
  const columns = [
    {
      key: 'partNumber',
      header: 'Part Number',
      sortable: true,
      render: (c: Component) => (
        <span className="font-mono text-sm font-medium text-primary-600">{c.partNumber}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      sortable: true,
      render: (c: Component) => (
        <span className="text-sm text-surface-500">{c.description || '-'}</span>
      ),
    },
    {
      key: 'stockQty',
      header: 'Stock',
      sortable: true,
      render: (c: Component) => {
        const status = stockStatus(c)
        const ratio = Math.min((c.stockQty / Math.max(c.minStock, 1)) * 100, 100)
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-16 h-1.5 bg-surface-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  c.stockQty === 0 ? 'bg-red-500' :
                  ratio <= 50 ? 'bg-red-500' :
                  ratio <= 100 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(ratio, 4)}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-surface-700 w-10 text-right">{c.stockQty}</span>
          </div>
        )
      },
    },
    {
      key: 'minStock',
      header: 'Min',
      sortable: true,
      render: (c: Component) => (
        <span className="text-sm text-surface-400">{c.minStock}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c: Component) => {
        const status = stockStatus(c)
        return (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold ${status.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        )
      },
    },
    {
      key: 'location',
      header: 'Loc',
      render: (c: Component) => (
        <span className="text-[11px] font-mono text-surface-400">{c.location || '-'}</span>
      ),
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
