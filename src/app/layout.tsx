import '../styles/globals.css'

import { Providers } from '@/components/Provider'
import { Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {



  return (
   
    <html lang='pt' className={`${poppins.variable}`}>
      <body>
        <Providers>
        <main className='h-screen flex flex-col font-poppins'>
          {children}
        </main>
        <Toaster position="top-right"/>
        </Providers>
      </body>
    </html>
  )
}
