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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-200 animate-pulse">
            <span className="text-2xl font-bold text-white">V</span>
          </div>
          <div className="w-48 h-1.5 bg-surface-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full animate-slide-up"
              style={{ animation: 'loading 1.5s ease-in-out infinite', width: '40%' }}
            />
          </div>
        </div>
        <style>{`@keyframes loading { 0% { transform: translateX(-100%) } 100% { transform: translateX(350%) } }`}</style>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return <>{children}</>
}
