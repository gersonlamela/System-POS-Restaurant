import { useEffect, useState } from 'react'
import { Table } from '@prisma/client'
import Link from 'next/link'
import { OrderData, useOrder } from '@/functions/OrderProvider'

interface TableItemProps {
  table: Table
}

const TableItem = ({ table }: TableItemProps) => {
  const { orders, createEmptyOrderForTable } = useOrder()
  const [elapsedTime, setElapsedTime] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)

  const orderForTable = orders[table.number.toString()]

  const formatElapsedTime = (createdAt: string) => {
    const currentTime = new Date()
    const creationTime = new Date(createdAt)
    const diff = Math.floor(
      (currentTime.getTime() - creationTime.getTime()) / 1000,
    )

    const hours = Math.floor(diff / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    const seconds = diff % 60

    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')

    if (hours === 0) {
      return `${formattedMinutes}:${formattedSeconds}`
    } else {
      return `${hours}:${formattedMinutes}:${formattedSeconds}`
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (orderForTable) {
        setElapsedTime(formatElapsedTime(orderForTable.createdAt))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [orderForTable])

  useEffect(() => {
    if (orderForTable) {
      let total = 0
      orderForTable.products.forEach((item) => {
        total += item.price * item.quantity
      })
      setTotalPrice(total)
    }
  }, [orderForTable])

  const handleTableClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!orderForTable) {
      e.preventDefault()
      createEmptyOrderForTable(table.number.toString())
      location.href = `/order/${table.number}` // Redireciona após a criação da ordem
    }
  }

  return (
    <Link
      className={`relative flex h-[120px] w-[194px] cursor-pointer flex-col items-center justify-evenly rounded-[5px] ${orderForTable ? 'bg-primary' : 'bg-success'} bg-opacity-40 p-[15px] text-base font-medium `}
      href={`/order/${table.number}`}
      passHref
      onClick={handleTableClick}
    >
      <div
        className={`absolute right-[15px] top-[15px] h-[15px] w-[15px] rounded-full border border-white ${orderForTable ? 'bg-primary' : 'bg-success'}`}
      ></div>
      <div className="flex flex-col items-center justify-center">
        <div>#{String(table.number).padStart(3, '0')}</div>
        {orderForTable && (
          <div className="flex flex-col items-center justify-center text-white">
            <span>{elapsedTime}</span>
            <span>{orderForTable.userName}</span>
            <span className="text-base text-black">
              {totalPrice.toFixed(2)}€
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
          <div className="h-[15px] w-[15px] gap-[10px] rounded-full bg-primary" />
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
          <div className="h-[15px] w-[15px] gap-[10px] rounded-full bg-primary" />
          <div className="text-[14px] font-medium text-third">
            ({occupiedTables})
          </div>
        </div>
      </div>
    </div>
  )
}
