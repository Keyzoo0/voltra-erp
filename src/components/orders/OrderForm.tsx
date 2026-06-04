'use client'

import { useState } from 'react'
import { Button } from '@/components/common/Button'

interface OrderFormProps {
  onSubmit: (data: any) => Promise<void>
  boms: { id: string; pcbName: string }[]
  initialData?: any
  onCancel: () => void
}

export function OrderForm({ onSubmit, boms, initialData, onCancel }: OrderFormProps) {
  const [client, setClient] = useState(initialData?.client || '')
  const [priority, setPriority] = useState(initialData?.priority || 'normal')
  const [dueDate, setDueDate] = useState(initialData?.dueDate?.split('T')[0] || '')
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [selectedBom, setSelectedBom] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        client,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        notes,
        items: [{ bomId: selectedBom, quantity }],
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">Client</label>
        <input
          type="text"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 placeholder-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all"
          placeholder="Nama client..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">BOM (PCB Design)</label>
        <select
          value={selectedBom}
          onChange={(e) => setSelectedBom(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all"
        >
          <option value="">Pilih BOM...</option>
          {boms.map((bom) => (
            <option key={bom.id} value={bom.id}>{bom.pcbName}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-full px-3.5 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3.5 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 placeholder-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 transition-all resize-none"
          placeholder="Optional notes..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : initialData ? 'Update Order' : 'Create Order'}
        </Button>
      </div>
    </form>
  )
}
