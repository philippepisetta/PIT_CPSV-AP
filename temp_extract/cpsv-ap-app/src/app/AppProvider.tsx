// src/app/AppProvider.tsx

"use client"

import { Providers } from "./providers"
import { ReactQueryProvider } from "../lib/query"
import { ReactNode } from "react"

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </Providers>
  )
}
