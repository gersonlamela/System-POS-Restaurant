import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import Navbar from '@/components/Navbar'
import { UserSignIn } from '@/components/form/UserSignIn'
import { SideBar } from '@/components/pos/SideBar'
import { handleGetProductsCategory } from '@/functions/Product/product'

export default async function Home() {
  const session = await getServerSession(authOptions)
  const category = await handleGetProductsCategory()

  return (
    <div>
      <Navbar />
      <SideBar categories={category} />
    </div>
  )
}
