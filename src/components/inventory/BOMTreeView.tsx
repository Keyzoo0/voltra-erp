'use client'

import { Bom } from '@/types'

interface BOMTreeViewProps {
  bom: Bom
}

export function BOMTreeView({ bom }: BOMTreeViewProps) {
  const totalCost = bom.bomLines.reduce((sum, line) => {
    return sum + (line.component?.stockQty || 0) * line.qtyPerUnit
  }, 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
        <div>
          <h4 className="font-medium text-blue-900">{bom.pcbName}</h4>
          <p className="text-sm text-blue-700">Rev {bom.revision}</p>
        </div>
        <span className="text-sm font-medium text-blue-900">
          {bom.bomLines.length} components
        </span>
      </div>

      <div className="border rounded-lg divide-y">
        {bom.bomLines.map((line) => (
          <div key={line.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{line.component?.partNumber}</span>
                {line.designator && (
                  <span className="text-xs text-gray-400">({line.designator})</span>
                )}
              </div>
              <p className="text-xs text-gray-500">{line.component?.description}</p>
            </div>
            <div className="text-right text-sm">
              <p className={line.component?.stockQty < line.qtyPerUnit ? 'text-red-600 font-medium' : ''}>
                {line.component?.stockQty ?? 0} / {line.qtyPerUnit}
              </p>
              <p className="text-xs text-gray-400">
                {line.component?.stockQty && line.component.stockQty >= line.qtyPerUnit
                  ? '✓ Available'
                  : '✗ Insufficient'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
