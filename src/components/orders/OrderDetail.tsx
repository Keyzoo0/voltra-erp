'use client'

import { Order } from '@/types'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/common/Button'
import { OrderTimeline } from './OrderTimeline'
import { formatDate, formatCurrency, VALID_TRANSITIONS } from '@/lib/utils'

interface OrderDetailProps {
  order: Order
  onStatusUpdate: (status: string, notes?: string) => Promise<void>
  userRole?: string
}

export function OrderDetail({ order, onStatusUpdate, userRole }: OrderDetailProps) {
  const allowedTransitions = VALID_TRANSITIONS[order.status] || []

  const canUpdate = userRole && ['admin', 'supervisor'].includes(userRole)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{order.client}</h3>
          <p className="text-sm text-gray-500">
            Order #{order.id.slice(0, 8)} · Dibuat {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <span className="text-xs text-gray-500">Priority</span>
          <p className="font-medium capitalize">{order.priority}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Due Date</span>
          <p className="font-medium">{formatDate(order.dueDate)}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Creator</span>
          <p className="font-medium">{order.creator?.name || '-'}</p>
        </div>
      </div>

      {order.notes && (
        <div>
          <span className="text-sm font-medium text-gray-700">Notes:</span>
          <p className="text-sm text-gray-600 mt-1">{order.notes}</p>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
        <div className="border rounded-lg divide-y">
          {order.orderItems.map((item) => (
            <div key={item.id} className="p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.bom.pcbName}</p>
                <p className="text-xs text-gray-500">Rev {item.bom.revision} · Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">{formatCurrency(Number(item.unitCost) * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {canUpdate && allowedTransitions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Update Status</h4>
          <div className="flex flex-wrap gap-2">
            {allowedTransitions.map((status) => (
              <Button
                key={status}
                size="sm"
                variant="secondary"
                onClick={() => onStatusUpdate(status)}
              >
                → {status}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline</h4>
        <OrderTimeline logs={order.statusLogs} />
      </div>
    </div>
  )
}
