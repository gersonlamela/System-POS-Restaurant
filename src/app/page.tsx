'use client'

import MenuList from '@/components/pos/MenuList'
import { OrderList } from '@/components/pos/OrderList'
import TableItem, { TableInfo } from '@/components/pos/TabeList'

import { Time } from '@/components/pos/Time'
import { UserAuth } from '@/components/pos/UserAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrder } from '@/functions/OrderProvider'

import { handleGetTables } from '@/functions/Table/table'
import { SignOut } from '@phosphor-icons/react'
import { signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function Order() {
  const [tables, setTables] = useState([])
  const { orders } = useOrder()

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const fetchedTables = await handleGetTables()
        setTables(fetchedTables)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // Verificar se as mesas já foram buscadas
    if (tables.length === 0) {
      fetchTables()
    }
  }, []) // Lista de dependências vazia, executa apenas uma vez

  const skeletonArray = Array.from({ length: 6 })

  return (
    <div className="flex w-full flex-row gap-[15px]">
      <div className="flex h-full flex-1 flex-col   gap-[15px]">
        <div className="flex max-h-[50px] w-full flex-1 flex-row gap-[15px]">
          <Time />
          <UserAuth />
        </div>

        <div className="flex h-full flex-1 flex-col  justify-between gap-[15px]">
          <div className="flex h-full  flex-row gap-[15px]">
            <div className="flex flex-1 gap-[15px]">
              {tables.length > 0 ? (
                tables.map((table, index) => (
                  <TableItem key={index} table={table} />
                ))
              ) : (
                <div className="grid w-full grid-cols-auto-fill-100 items-center gap-[15.5px] overflow-y-auto">
                  {skeletonArray.map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-[200px] w-[199.5px] bg-[#7b7b85]"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex max-w-[335px] flex-1 flex-col justify-between gap-[15px]">
              <OrderList />
            </div>
          </div>

          <div className=" flex flex-1 items-center  gap-[15px]">
            <div className="flex h-[114px] w-[202px] items-center justify-center rounded-[10px] bg-LightGray shadow-button20">
              <button
                onClick={() =>
                  signOut({
                    redirect: true,
                    callbackUrl: `${window.location.origin}/`,
                  })
                }
                className="flex h-[84px] w-[80px] flex-col items-center justify-center gap-[8px] rounded-[10px] bg-secondary font-semibold text-white"
              >
                <SignOut size={25} />
                Sair
              </button>
            </div>
            <div className="flex w-full  flex-col gap-[15px]">
              <TableInfo full={1} Tables={tables} orders={orders} />
              <MenuList />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
