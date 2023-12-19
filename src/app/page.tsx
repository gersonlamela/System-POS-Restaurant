

import { getServerSession } from 'next-auth'

import { authOptions } from './api/auth/[...nextauth]/route'
import { User } from './user'

import Link from 'next/link'

export default async function Home() {



  
  const session = await getServerSession(authOptions)
  return (
  <main>
    <h1>Server Session</h1>
    <pre>{JSON.stringify(session)}</pre>
    <h2>Client Call</h2>
    <User/>

  <div className='flex gap-10'>

  <Link href={"/sign-in"} >Sign In</Link>
  <Link href={"/sign-up"}>Sign Up</Link>
  </div>

  </main>

  )
}
