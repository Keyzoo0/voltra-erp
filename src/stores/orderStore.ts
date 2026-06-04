import { create } from 'zustand'
import { Order } from '@/types'

interface OrderStore {
  orders: Order[]
  selectedOrder: Order | null
  isLoading: boolean
  fetchOrders: (filters?: Record<string, string>) => Promise<void>
  fetchOrder: (id: string) => Promise<void>
  updateStatus: (id: string, status: string, notes?: string) => Promise<void>
}

const API = (path: string, init?: RequestInit) =>
  fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...init?.headers,
    },
  })

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,

  fetchOrders: async (filters) => {
    set({ isLoading: true })
    try {
      const params = new URLSearchParams(filters)
      const res = await API(`/orders?${params}`)
      if (res.ok) set({ orders: await res.json() })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchOrder: async (id) => {
    set({ isLoading: true })
    try {
      const res = await API(`/orders/${id}`)
      if (res.ok) set({ selectedOrder: await res.json() })
    } finally {
      set({ isLoading: false })
    }
  },

  updateStatus: async (id, status, notes) => {
    const res = await API(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    })
    if (res.ok) {
      const updated = await res.json()
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updated : o)),
        selectedOrder: state.selectedOrder?.id === id ? updated : state.selectedOrder,
      }))
    }
  },
}))
