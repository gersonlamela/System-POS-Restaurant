'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './theme-provider'
import OrderProvider from '@/functions/OrderProvider'

type Props = {
  children?: React.ReactNode
}

export const Providers = ({ children }: Props) => (
  <SessionProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <OrderProvider>{children}</OrderProvider>
    </ThemeProvider>
  </SessionProvider>
)
