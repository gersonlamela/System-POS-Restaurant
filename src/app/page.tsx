import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import Navbar from '@/components/Navbar'
import { UserSignIn } from '@/components/form/UserSignIn'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      {!session?.user && <UserSignIn />}

      <Navbar />

      <h1 className="text-4xl">Home</h1>
    </div>
  )
}
