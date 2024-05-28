'use client'

import { getRole } from '@/functions/user/user'
import { SignOut } from '@phosphor-icons/react'

import { signOut, useSession } from 'next-auth/react'

export default function UserCard() {
  const { data: session } = useSession()

  console.log(session)
  if (!session) {
    return null
  }

  return (
    <div className="mb-4 flex flex-col items-center justify-center gap-2 md:flex-row ">
      <div className="flex flex-col items-center justify-center">
        <div className="text-base font-semibold uppercase leading-3 text-third">
          {session.user?.name}
        </div>
        <div className="text-secondary-foreground  text-[14px] font-medium capitalize  text-third">
          {getRole(session?.user?.role)}
        </div>
      </div>

      <button onClick={() => signOut()}>
        <SignOut size={25} className="text-third hover:text-red-500" />
      </button>
    </div>
  )
}
