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
  { key: 'id', header: 'ID', sortable: true, render: (o: Order) => o.id.slice(0, 8) + '...' },
  { key: 'client', header: 'Client', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (o: Order) => <StatusBadge status={o.status} />,
  },
  { key: 'priority', header: 'Priority', sortable: true },
  {
    key: 'dueDate',
    header: 'Due Date',
    sortable: true,
    render: (o: Order) => formatDateShort(o.dueDate),
  },
  {
    key: 'createdAt',
    header: 'Created',
    sortable: true,
    render: (o: Order) => formatDateShort(o.createdAt),
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
