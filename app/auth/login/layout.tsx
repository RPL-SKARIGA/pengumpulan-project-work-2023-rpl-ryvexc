import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - MyWallet',
  description: 'MyWallet',
}

export default function Layout({ children }: any) {
  return <>
    {children}
  </>
}