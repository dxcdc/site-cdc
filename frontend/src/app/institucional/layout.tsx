import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Institucional | CDC' }

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
