'use client'

import React, { Suspense, useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

import Clock from 'react-live-clock'
import { useHydration } from '@/hooks/useHydration'

export function Time() {
  const [agora] = useState(new Date()) // Inicializa com a data atual

  const dia = format(agora, 'dd/MM/yy', { locale: pt })
  const hydrated = useHydration()

  return (
    <Suspense>
      <div className="flex h-[50px] w-full items-center justify-between rounded-[10px] bg-white  px-[15px] shadow-button5">
        <div className="w-[90px] text-[20px] font-medium text-secondary">
          {hydrated && <Clock format={'HH:mm:ss'} ticking={true} />}
        </div>
        <div className="text-[20px] font-medium text-secondary">
          {hydrated && dia}
        </div>
      </div>
    </Suspense>
  )
}
