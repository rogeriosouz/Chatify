import { QueryClient } from '@tanstack/react-query'

export const querryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})
