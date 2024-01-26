'use client'

import { SessionProvider, signOut } from 'next-auth/react'
import { ThemeProvider } from './theme-provider'

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
      {children}
    </ThemeProvider>
  </SessionProvider>
)
