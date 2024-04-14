'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

export function Time() {
  const [agora, setAgora] = useState(new Date()) // Inicializa com a data atual

  const updateTime = () => {
    setAgora(new Date()) // Atualiza com a nova data
  }

  // Atualiza a cada segundo
  setInterval(updateTime, 1000)

  const time = format(agora, 'HH:mm:ss', { locale: pt })
  const dia = format(agora, 'dd/MM/yy', { locale: pt })

  return (
    <div className="flex h-[50px] w-full items-center justify-between rounded-[10px] bg-LightGray px-[15px] shadow">
      <div className="w-[90px] text-[20px] font-medium text-third">{time}</div>
      <div className="text-[22px] font-bold text-third">POSlamela</div>
      <div className="text-[20px] font-medium text-third">{dia}</div>
    </div>
  )
}
