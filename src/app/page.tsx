import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import Navbar from '@/components/Navbar'
import { UserSignIn } from '@/components/form/UserSignIn'
import { SideBar } from '@/components/pos/SideBar'
import { handleGetProductsCategory } from '@/functions/Product/product'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-4">
        <div className="">Mesa</div>
      </div>
      {session?.user ? 'ola' : <UserSignIn />}
    </div>
  )
}
