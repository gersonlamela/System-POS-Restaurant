import { useEffect, useState } from 'react'
import { OrderData, useOrder } from '@/functions/OrderProvider'
import { Table } from '@prisma/client'
import Link from 'next/link'

interface TableListProps {
  Tables: Table[]
}

export function TableList({ Tables }: TableListProps) {
  return (
    <div className="grid h-full w-full grid-cols-auto-fill-194 gap-[15px]  rounded-[10px] bg-[#F7F7F8] px-[15px] pb-[50px] pt-[15px] shadow-button10">
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

  return (
    <Link
      className={`relative flex h-[120px] w-[194px] cursor-pointer flex-col items-center justify-evenly rounded-[5px] ${orderForTable ? 'bg-[#FF0000]' : 'bg-[#88E152]'} bg-opacity-40 p-[15px] text-base font-medium `}
      href={`/order/${table.number}`}
      onClick={(e) => {
        if (!orderForTable) {
          e.preventDefault()
          createEmptyOrderForTable(table.number.toString())
        }
      }}
    >
      <div
        className={`absolute right-[15px] top-[15px] h-[15px] w-[15px] rounded-full border border-white ${orderForTable ? 'bg-[#FF0000]' : 'bg-[#88E152]'}`}
      ></div>
      <div className="flex flex-col items-center justify-center">
        <div>#{String(table.number).padStart(3, '0')}</div>
        {orderForTable && (
          <div className="flex flex-col items-center justify-center text-white">
            <span>{elapsedTime}</span>
            <span>{orderForTable.userName}</span>
            <span className="text-base text-black">
              {orderForTable.totalPrice}€
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default TableItem

interface TableInfoProps {
  full: number
  Tables: Table[]
  orders: Record<string, OrderData>
}

export function TableInfo({ Tables, orders }: TableInfoProps) {
  // Contar o número total de mesas
  const totalTables = Tables.length

  // Contar o número de mesas com pedidos associados
  const occupiedTables = Tables.filter((table) => {
    const orderForTable = orders[table.number.toString()]
    return orderForTable !== undefined
  }).length

  // Calcular o número de mesas livres
  const freeTables = totalTables - occupiedTables

  return (
    <div className="flex h-[29px] w-full items-center  justify-between rounded-[10px] bg-LightGray px-[15px] shadow-button10">
      <div className="flex flex-row items-center gap-[35px]">
        <div className="font-medium text-third">MESAS:</div>
        <div className="flex flex-row items-center justify-center gap-[10px] ">
          <div className="h-[15px] w-[15px] gap-[10px] rounded-full bg-success" />
          <div className="text-[14px] font-medium text-third">Livre</div>
        </div>

        <div className="flex flex-row items-center justify-center gap-[10px] ">
          <div className="h-[15px] w-[15px] gap-[10px] rounded-full bg-destructive" />
          <div className="text-[14px] font-medium text-third">Ocupada</div>
        </div>
      </div>
      <div className=" flex flex-row gap-[35px]">
        <div className="flex flex-row items-center justify-center gap-[10px] ">
          <div className="h-[15px] w-[15px] gap-[10px] rounded-full bg-success" />
          <div className="text-[14px] font-medium text-third">
            ({freeTables})
          </div>
        </div>

        <div className="flex flex-row items-center justify-center gap-[10px] ">
          <div className="h-[15px] w-[15px] gap-[10px] rounded-full bg-destructive" />
          <div className="text-[14px] font-medium text-third">
            ({occupiedTables})
          </div>
        </div>
      </div>
    </div>
  )
}
