import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - MyWallet',
  description: 'MyWallet',
}

export default function Layout({ children }: any) {
  return <>
    {children}
  </>
}