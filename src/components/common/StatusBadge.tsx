'use client'

import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
  size?: 'sm' | 'md'
}

const STATUS_STYLES: Record<string, { label: string; bg: string; dot: string }> = {
  DRAFT:     { label: 'Draft',     bg: 'bg-gray-100 text-gray-700',     dot: 'bg-gray-400' },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
  IN_PROD:   { label: 'In Prod',   bg: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500' },
  ON_HOLD:   { label: 'On Hold',   bg: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  QC:        { label: 'QC',        bg: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  QC_FAIL:   { label: 'QC Fail',   bg: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
  PACKING:   { label: 'Packing',   bg: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  SHIPPED:   { label: 'Shipped',   bg: 'bg-cyan-100 text-cyan-700',     dot: 'bg-cyan-500' },
  COMPLETED: { label: 'Completed', bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
}

export function StatusBadge({ status, className, size = 'sm' }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || { label: status, bg: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        style.bg,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
      {style.label}
    </span>
  )
}
