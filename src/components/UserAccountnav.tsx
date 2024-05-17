'use client'

import { signOut } from 'next-auth/react'
import { Button } from './ui/button'

interface userProps {
  name: string
}
export default function UserAccountnav(userProps: userProps) {
  return (
    <div className="flex  items-center justify-center gap-2">
      <h1 className="text-xl">{userProps.name}</h1>
      <Button
        className="bg-red-600 text-white"
        onClick={() =>
          signOut({ redirect: true, callbackUrl: `${location.origin}/` })
        }
        variant="destructive"
      >
        Sign Out
      </Button>
    </div>
  )
}
