import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { Sidebar } from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Voltra ERP — Production & Inventory Management',
  description: 'Sistem manajemen produksi & inventory untuk UMKM Elektronika',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-surface-50 text-surface-900 min-h-screen antialiased`}>
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen">
              <div className="animate-in p-8 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
