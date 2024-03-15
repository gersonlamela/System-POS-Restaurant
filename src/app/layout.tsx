import '../styles/globals.css'

import { Providers } from '@/components/Provider'
import { Poppins } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className={`${poppins.variable} font-poppins`}>
      <body>
        <Providers>
          <main className="flex h-screen flex-col">{children}</main>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
