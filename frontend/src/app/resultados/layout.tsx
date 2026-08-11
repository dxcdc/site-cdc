import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Resultados da busca | CDC' }

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
