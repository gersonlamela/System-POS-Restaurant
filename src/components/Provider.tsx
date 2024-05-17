'use client'

import { SessionProvider } from 'next-auth/react'
import OrderProvider from '@/functions/OrderProvider'

type Props = {
  children?: React.ReactNode
}

export const Providers = ({ children }: Props) => (
  <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
    <OrderProvider>{children}</OrderProvider>
  </SessionProvider>
)
