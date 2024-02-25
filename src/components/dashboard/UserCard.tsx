'use client'

import { LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

export default function UserCard() {
  const { data: session } = useSession()
  return (
    <div className="flex flex-col items-center justify-center gap-2 md:flex-row ">
      <div className="flex flex-col items-center justify-center ">
        <div>{session?.user.name}</div>
        <div> {session?.user.email}</div>
      </div>

      <button onClick={() => signOut()}>
        <LogOut size={17} />
      </button>
    </div>
  )
}
