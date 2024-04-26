import '../styles/globals.css'

import { Providers } from '@/components/Provider'
import { Poppins } from 'next/font/google'

import { Header } from '@/components/pos/Header'
import { Footer } from '@/components/pos/Footer'

import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'
import UserSignIn from '@/components/form/UserSignIn'
import { Toaster } from 'sonner'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="pt" className={`${poppins.variable} font-poppins`}>
      <body className="max-w-screen flex h-screen flex-col">
        <Providers>
          <Toaster position="top-right" />
          <Header />
          <main className="flex flex-1 overflow-auto  px-[15px] pb-[10px] pt-[15px]">
            {children}
          </main>
          <Footer />
          {!session && <UserSignIn />}
        </Providers>
      </body>
    </html>
  )
}
