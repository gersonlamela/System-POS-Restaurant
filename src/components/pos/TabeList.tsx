import { useEffect, useState } from 'react'
import { useOrder } from '@/functions/OrderProvider'
import { Table } from '@prisma/client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Skeleton } from '../ui/skeleton'

interface TableListProps {
  Tables: Table[]
}

export function TableList({ Tables }: TableListProps) {
  return (
    <div className="grid max-h-[771px] w-full flex-1 grid-cols-auto-fill-100 justify-items-center gap-[15.5px] overflow-y-auto">
      {Tables ? (
        Tables.map((table, index) => <TableItem key={index} table={table} />)
      ) : (
        <h1>Sem Mesas</h1>
      )}
    </div>
  )
}

interface TableItemProps {
  table: Table
}

const TableItem = ({ table }: TableItemProps) => {
  const { createEmptyOrderForTable, orders } = useOrder()
  const [elapsedTime, setElapsedTime] = useState('')

  // Verifica se há uma ordem para a mesa atual
  const orderForTable = orders[table.number.toString()]

  // Função para formatar o tempo decorrido desde a criação da ordem
  const formatElapsedTime = (createdAt: string) => {
    const currentTime = new Date()
    const creationTime = new Date(createdAt)
    const diff = Math.floor(
      (currentTime.getTime() - creationTime.getTime()) / 1000,
    ) // Diferença em segundos

    const hours = Math.floor(diff / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    const seconds = diff % 60

    // Adicionando zeros à esquerda para minutos e segundos, se necessário
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')

    if (minutes === 0 && hours === 0) {
      return `00:${formattedSeconds}`
    } else if (hours === 0) {
      return `${formattedMinutes}:${formattedSeconds}`
    } else {
      return `${hours}:${formattedMinutes}:${formattedSeconds}`
    }
  }

  useEffect(() => {
    // Atualizar o tempo decorrido a cada segundo
    const timer = setInterval(() => {
      if (orderForTable) {
        setElapsedTime(formatElapsedTime(orderForTable.createdAt))
      }
    }, 1000)

    return () => clearInterval(timer) // Limpar o intervalo quando o componente é desmontado
  }, [orderForTable])

  const { data: session } = useSession()

  const userName = session?.user?.name || 'Anônimo'
  return (
    <Link
      href={`/order/${table.number}`}
      onClick={() =>
        !orderForTable &&
        createEmptyOrderForTable(table.number.toString(), userName?.toString())
      }
      className="relative flex h-[200px] w-[199.5px] cursor-pointer flex-col items-center justify-between"
    >
      <div className="relative flex h-full w-full bg-third">
        <div className="flex flex-1">ola</div>
        <div className="absolute inset-0 top-[8.75rem] flex flex-col bg-black bg-opacity-30 pb-[10px] pl-[15px] pt-[8px]">
          {orderForTable ? (
            <div className="flex flex-col gap-[5px]">
              {elapsedTime ? (
                <span className="text-[12px] font-semibold text-white">
                  {elapsedTime}
                </span>
              ) : (
                <Skeleton className="h-[12px] w-[80px] bg-[#7b7b85]" />
              )}
              <span className="text-[12px] font-semibold text-white">
                {orderForTable.userName}
              </span>
            </div>
          ) : (
            <span className="text-[12px] font-semibold text-white">
              {table.number}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
