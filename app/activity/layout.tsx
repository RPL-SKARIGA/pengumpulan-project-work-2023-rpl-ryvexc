import type { Metadata } from 'next'
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Activity - MyWallet',
  description: 'MyWallet',
}

export default function Layout({ children }: any) {
  return <div className={inter.className}>
    {children}
  </div>;
}