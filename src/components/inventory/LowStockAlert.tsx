'use client'

import { Component } from '@/types'
import { Button } from '@/components/common/Button'

interface LowStockAlertProps {
  components: Component[]
}

export function LowStockAlert({ components }: LowStockAlertProps) {
  if (components.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl m-4">
        <span className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </span>
        <span className="text-sm font-medium">Semua stok aman</span>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </span>
          <h4 className="text-sm font-semibold text-red-700">
            {components.length} komponen di bawah minimum stok
          </h4>
        </div>
        <Button size="sm" variant="danger">
          <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Generate PR
        </Button>
      </div>
      <div className="border border-red-100 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-red-50">
          <thead className="bg-red-50/50">
            <tr>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-red-500 uppercase">Part Number</th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-red-500 uppercase">Description</th>
              <th className="px-4 py-2.5 text-right text-[10px] font-semibold text-red-500 uppercase">Stock</th>
              <th className="px-4 py-2.5 text-right text-[10px] font-semibold text-red-500 uppercase">Min</th>
              <th className="px-4 py-2.5 text-right text-[10px] font-semibold text-red-500 uppercase">Supplier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-50">
            {components.map((c) => (
              <tr key={c.id} className="hover:bg-red-50/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-medium text-red-700">{c.partNumber}</span>
                </td>
                <td className="px-4 py-3 text-sm text-surface-500">{c.description || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-bold text-red-600">{c.stockQty}</span>
                </td>
                <td className="px-4 py-3 text-right text-sm text-surface-400">{c.minStock}</td>
                <td className="px-4 py-3 text-right text-sm text-surface-400">{c.supplier?.name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
