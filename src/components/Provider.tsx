'use client'


import { SessionProvider, signOut } from "next-auth/react"

type Props = {
  children?: React.ReactNode
}

export const Providers = ({children}: Props) => (
  <SessionProvider>
    {children}
  </SessionProvider>
)