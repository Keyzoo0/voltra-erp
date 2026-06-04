'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { LoginPage } from './LoginPage'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading, checkAuth } = useAuthStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    checkAuth().finally(() => setInitialized(true))
  }, [checkAuth])

  if (!initialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!user) return <LoginPage />

  return <>{children}</>
}
