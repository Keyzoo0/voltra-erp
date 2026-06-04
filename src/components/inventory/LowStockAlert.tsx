'use client'

import { Component } from '@/types'
import { Button } from '@/components/common/Button'

interface LowStockAlertProps {
  components: Component[]
}

export function LowStockAlert({ components }: LowStockAlertProps) {
  if (components.length === 0) {
    return (
      <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg">
        <span className="text-lg">✓</span>
        <span className="text-sm font-medium">Semua stok aman</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-red-700">
          {components.length} komponen di bawah minimum stok
        </h4>
        <Button size="sm" variant="danger">Generate Purchase Request</Button>
      </div>
      <div className="border rounded-lg divide-y">
        {components.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium">{c.partNumber}</p>
              <p className="text-xs text-gray-500">{c.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-red-600">{c.stockQty} / {c.minStock}</p>
              <p className="text-xs text-gray-400">{c.supplier?.name || '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
