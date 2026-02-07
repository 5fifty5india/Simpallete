import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import AppNavigation from '@/components/AppNavigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Simpalette - Costume Management',
  description: 'Visual costume planning for film and television',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-neutral-950">
            <AppNavigation />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
