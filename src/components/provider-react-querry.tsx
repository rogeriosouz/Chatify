'use client'
import { querryClient } from '@/lib/react-querry'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

export function ProviderReactQuerry({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={querryClient}>{children}</QueryClientProvider>
  )
}
