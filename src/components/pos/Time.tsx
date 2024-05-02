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
      <div className="flex h-[50px] w-full items-center justify-between rounded-[10px] bg-LightGray px-[15px] shadow">
        <div className="w-[90px] text-[20px] font-medium text-third">
          {hydrated && <Clock format={'HH:mm:ss'} ticking={true} />}
        </div>
        <div className="text-[22px] font-bold text-third">POSlamela</div>
        <div className="text-[20px] font-medium text-third">
          {hydrated && dia}
        </div>
      </div>
    </Suspense>
  )
}
