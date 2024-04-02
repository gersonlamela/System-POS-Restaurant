'use client'

import { getRole } from '@/functions/user/user'

import { LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

export default function UserCard() {
  const { data: session } = useSession()
  return (
    <div className="mb-4 flex flex-col items-center justify-center gap-2 md:flex-row ">
      <div className="flex flex-col items-center justify-center ">
        <div className="text-xl font-semibold">{session?.user.name}</div>
        <div className="text-base font-medium capitalize  text-secondary-foreground">
          {getRole((session as any)?.user.role)}
        </div>
      </div>

      <button onClick={() => signOut()}>
        <LogOut size={25} className="hover:text-red-500" />
      </button>
    </div>
  )
}
