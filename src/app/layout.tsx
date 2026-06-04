import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { Sidebar } from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Voltra ERP — Production & Inventory Management',
  description: 'Sistem manajemen produksi & inventory untuk UMKM Elektronika',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
