'use client'

import MenuList from '@/components/pos/MenuList'
import { OrderList } from '@/components/pos/OrderList'
import { TableList } from '@/components/pos/TabeList'

import { Time } from '@/components/pos/Time'
import { UserAuth } from '@/components/pos/UserAuth'
import { Skeleton } from '@/components/ui/skeleton'

import { handleGetTables } from '@/functions/Table/table'
import { useState, useEffect } from 'react'

export default function Order() {
  const [tables, setTables] = useState([])

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const fetchedTables = await handleGetTables()
        setTables(fetchedTables)
      } catch (error) {
        console.error('Error fetching tables:', error)
      }
    }
    fetchTables()
  }, [])

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
            <div className="flex flex-1">
              {tables.length > 0 ? (
                <TableList Tables={tables} />
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

          <div className=" flex w-full flex-1 items-center ">
            <MenuList />
          </div>
        </div>
      </div>
    </div>
  )
}
