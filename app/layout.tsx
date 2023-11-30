import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import { ThemeProvider } from "@/components/theme-provider"

import { Providers } from './provider'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Dashboard - MyWallet',
  description: 'MyWallet',
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
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
