import { getRole } from '@/functions/user/user'

import { useSession } from 'next-auth/react'
import { Skeleton } from '../ui/skeleton'

export function UserAuth() {
  const { data: session, status } = useSession()

  // Verifica o status da sessão e exibe o Skeleton se estiver carregando
  if (status === 'loading') {
    return (
      <div className="flex h-[50px] min-w-[335px] flex-col items-center justify-center gap-[5px] rounded-[10px] bg-secondary px-[10px]">
        <Skeleton className="h-4 w-[250px] bg-[#7b7b85]" />
        <Skeleton className="h-4 w-[200px]  bg-[#7b7b85]" />
      </div>
    )
  }

  // Se houver uma sessão, exibe os dados do Utilizador
  if (session) {
    return (
      <div className="flex h-[50px] min-w-[335px] items-center justify-between rounded-[10px] bg-secondary px-[10px]">
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="text-base font-semibold uppercase text-white">
            {session.user.name && session.user.name}
          </span>
          <div className="text-sm font-medium text-white">
            {getRole(session.user.role)}
          </div>
        </div>
      </div>
    )
  }

  // Se não houver sessão, retorna null ou uma mensagem de não autenticado, dependendo do seu caso
  return null
}
