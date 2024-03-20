"use client"
import React, { useState } from "react"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

function Provider({ children }: any) {
  const [client] = useState(new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 6 * 1000,
        refetchInterval: 6 * 1000,
      }
    }
  }))

  return (
    <>
      <QueryClientProvider client={client}>
        <ReactQueryStreamedHydration>
          {children}
        </ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

export { Provider }
