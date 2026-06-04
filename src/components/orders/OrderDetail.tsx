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
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-900">{order.client}</h3>
            <p className="text-sm text-surface-400 font-medium mt-0.5">
              Order #{order.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} size="md" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Priority', value: order.priority, color: 'text-primary-600' },
          { label: 'Due Date', value: formatDate(order.dueDate), color: 'text-surface-900' },
          { label: 'Creator', value: order.creator?.name || '-', color: 'text-surface-900' },
        ].map((item) => (
          <div key={item.label} className="p-3.5 bg-surface-50 rounded-xl">
            <span className="text-xs text-surface-400 font-medium">{item.label}</span>
            <p className={`text-sm font-semibold mt-0.5 capitalize ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-surface-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Created {formatDate(order.createdAt)}
      </div>

      {order.notes && (
        <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-100/50">
          <div className="flex items-center gap-2 mb-1.5">
            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Notes</span>
          </div>
          <p className="text-sm text-surface-600">{order.notes}</p>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-surface-900 mb-3">Order Items</h4>
        <div className="border border-surface-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-surface-50">
            <thead>
              <tr className="bg-surface-50/50">
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-surface-400 uppercase tracking-wider">PCB</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-surface-400 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-surface-400 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {order.orderItems.map((item) => (
                <tr key={item.id} className="hover:bg-surface-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-surface-900">{item.bom.pcbName}</p>
                    <p className="text-[10px] text-surface-400 font-mono">Rev {item.bom.revision}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-surface-700">{item.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-bold text-surface-900">
                      {formatCurrency(Number(item.unitCost) * item.quantity)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {canUpdate && allowedTransitions.length > 0 && (
        <div className="p-4 bg-surface-50 rounded-xl">
          <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Update Status</h4>
          <div className="flex flex-wrap gap-2">
            {allowedTransitions.map((status) => (
              <Button
                key={status}
                size="sm"
                variant="secondary"
                onClick={() => onStatusUpdate(status)}
              >
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                {status}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-surface-900 mb-3">Timeline</h4>
        <OrderTimeline logs={order.statusLogs} />
      </div>
    </div>
  )
}
