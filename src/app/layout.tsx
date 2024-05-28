import '../styles/globals.css'

import { Providers } from '@/components/Provider'
import { Poppins } from 'next/font/google'

import { Header } from '@/components/pos/Header'
import { Footer } from '@/components/pos/Footer'

import UserSignIn from '@/components/form/UserSignIn'
import { Toaster } from 'sonner'
import { Metadata } from 'next'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Mesas',
  icons: {
    icon: '/favicon.ico', // /public path
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="pt" className={`${poppins.className}`}>
      <body className="max-w-screen flex h-screen flex-col">
        <Providers>
          <Toaster position="top-right" />
          <Header />
          <main className="flex flex-1 overflow-auto">{children}</main>
          <Footer />
          {!session && <UserSignIn />}
        </Providers>
      </body>
    </html>
  )
}
