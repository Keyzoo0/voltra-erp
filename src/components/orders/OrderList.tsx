'use client'

import { DataTable } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Order } from '@/types'
import { formatDateShort } from '@/lib/utils'

interface OrderListProps {
  orders: Order[]
  isLoading: boolean
  onSelect: (order: Order) => void
}

const columns = [
  {
    key: 'id',
    header: 'Order',
    sortable: true,
    render: (o: Order) => (
      <span className="font-mono text-xs text-surface-400">#{o.id.slice(0, 8)}</span>
    ),
  },
  {
    key: 'client',
    header: 'Client',
    sortable: true,
    render: (o: Order) => (
      <span className="font-medium text-surface-700">{o.client}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (o: Order) => <StatusBadge status={o.status} />,
  },
  {
    key: 'priority',
    header: 'Priority',
    sortable: true,
    render: (o: Order) => (
      <span className={`text-xs font-semibold capitalize ${
        o.priority === 'urgent' ? 'text-red-600' :
        o.priority === 'high' ? 'text-amber-600' :
        'text-surface-400'
      }`}>
        {o.priority}
      </span>
    ),
  },
  {
    key: 'dueDate',
    header: 'Due',
    sortable: true,
    render: (o: Order) => (
      <span className="text-sm text-surface-500">{formatDateShort(o.dueDate)}</span>
    ),
  },
  {
    key: 'createdAt',
    header: 'Created',
    sortable: true,
    render: (o: Order) => (
      <span className="text-sm text-surface-400">{formatDateShort(o.createdAt)}</span>
    ),
  },
]

export function OrderList({ orders, isLoading, onSelect }: OrderListProps) {
  return (
    <DataTable
      columns={columns}
      data={orders}
      isLoading={isLoading}
      onRowClick={onSelect}
    />
  )
}
