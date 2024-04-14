'use client'

import { getRole } from '@/functions/user/user'

import { useSession } from 'next-auth/react'

export function UserAuth() {
  const { data: session } = useSession()
  return (
    <div className="flex h-[50px] min-w-[335px] items-center justify-between rounded-[10px] bg-secondary px-[10px]">
      {session ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="text-base font-semibold uppercase text-white">
            {session.user.name}
          </span>
          <div className="text-sm font-medium text-white">
            {getRole(session.user.role)}
          </div>
        </div>
      ) : (
        <h1>Erro Na Sessão</h1>
      )}
    </div>
  )
}
