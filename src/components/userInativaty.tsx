// Importe as bibliotecas necessárias e os tipos
'use client'

import React, { ReactNode, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Defina as propriedades do componente
interface InactivityTimeoutProps {
  children: ReactNode
}

// Defina o componente
export default function InactivityTimeoutComponent({
  children,
}: InactivityTimeoutProps) {
  const router = useRouter()
  const { data: session } = useSession() // Obtém o estado de sessão do usuário
  let inactiveTime = 0

  // Função para reiniciar o temporizador
  const handleUserActivity = () => {
    inactiveTime = 0
  }

  // Efeito que lida com a lógica de inatividade
  useEffect(() => {
    // Não faz nada se não estiver no navegador ou se o usuário não estiver logado
    if (typeof window === 'undefined' || !session) {
      return
    }

    const timerInterval = setInterval(() => {
      inactiveTime += 1

      // Verificar se o usuário está inativo por mais de 5 segundos
      if (inactiveTime >= 2000) {
        // Executar a função de logout fornecida
        router.push('/sign-in')
        signOut()

        console.log('utilizador desconectado ' + inactiveTime)
        // Reiniciar o temporizador
        inactiveTime = 0
      }
    }, 1000)

    // Adicionar event listeners para detectar atividade do usuário
    window.addEventListener('mousemove', handleUserActivity)
    window.addEventListener('keydown', handleUserActivity)

    // Limpar event listeners e temporizador ao desmontar o componente
    return () => {
      window.removeEventListener('mousemove', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
      clearInterval(timerInterval)
    }
  }, [inactiveTime, session])

  // Renderizar o conteúdo do componente
  return <>{children}</>
}
