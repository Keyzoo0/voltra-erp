'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
        variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-300',
        variant === 'gradient' && 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 focus:ring-primary-500 shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300',
        variant === 'secondary' && 'bg-white text-surface-700 border border-surface-200 hover:bg-surface-50 focus:ring-surface-400 shadow-sm',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md shadow-red-200',
        variant === 'ghost' && 'text-surface-500 hover:text-surface-700 hover:bg-surface-100 focus:ring-surface-400',
        size === 'sm' && 'px-3.5 py-1.5 text-xs font-semibold',
        size === 'md' && 'px-4 py-2.5 text-sm font-semibold',
        size === 'lg' && 'px-6 py-3 text-base font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
