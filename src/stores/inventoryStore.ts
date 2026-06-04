import { create } from 'zustand'
import { Component } from '@/types'

interface InventoryStore {
  components: Component[]
  lowStockAlerts: Component[]
  isLoading: boolean
  fetchComponents: (filters?: Record<string, string>) => Promise<void>
  updateStock: (id: string, qty: number) => Promise<void>
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

export const useInventoryStore = create<InventoryStore>((set) => ({
  components: [],
  lowStockAlerts: [],
  isLoading: false,

  fetchComponents: async (filters) => {
    set({ isLoading: true })
    try {
      const params = new URLSearchParams(filters)
      const res = await API(`/inventory?${params}`)
      if (res.ok) {
        const data = await res.json()
        set({
          components: data,
          lowStockAlerts: data.filter((c: Component) => c.stockQty <= c.minStock),
        })
      }
    } finally {
      set({ isLoading: false })
    }
  },

  updateStock: async (id, qty) => {
    const res = await API(`/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ stockQty: qty }),
    })
    if (res.ok) {
      const updated = await res.json()
      set((state) => ({
        components: state.components.map((c) => (c.id === id ? updated : c)),
        lowStockAlerts: state.components
          .filter((c) => c.stockQty <= c.minStock)
          .map((c) => (c.id === id ? updated : c)),
      }))
    }
  },
}))
