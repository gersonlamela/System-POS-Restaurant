

import { getServerSession } from 'next-auth'

import { authOptions } from './api/auth/[...nextauth]/route'
import { User } from './user'
import { signOut } from 'next-auth/react'

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

  <Link href={"/auth/signIn"} >Sign In</Link>
  <Link href={"/auth/signUp"}>Sign Up</Link>
  </div>

  </main>

  )
}
