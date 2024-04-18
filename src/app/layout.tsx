import '../styles/globals.css'

import { Providers } from '@/components/Provider'
import { Poppins } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/pos/Header'
import { Footer } from '@/components/pos/Footer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserSignIn } from '@/components/form/UserSignIn'

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
      <body className="max-w-screen flex h-screen flex-col border border-red-500">
        <Providers>
          <Header />
          <main className="flex flex-1 overflow-auto  px-[15px] pb-[10px] pt-[15px]">
            {children}
          </main>
          <Footer />
          {!session?.user.name && <UserSignIn />}
        </Providers>
      </body>
    </html>
  )
}
