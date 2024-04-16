'use client'

import MenuList from '@/components/pos/MenuList'

import { OrderList } from '@/components/pos/OrderList'
import { ProductList } from '@/components/pos/ProductList'
import { TableList } from '@/components/pos/TabeList'

import { Time } from '@/components/pos/Time'
import { UserAuth } from '@/components/pos/UserAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { handleGetProducts } from '@/functions/Product/product'
import { handleGetTables } from '@/functions/Table/table'
import { table } from 'console'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

export default function Order() {
  const [tables, setTables] = useState([])

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const fetchedTables = await handleGetTables()

        console.log(fetchedTables)
        setTables(fetchedTables)
      } catch (error) {
        console.error('Error fetching tables:', error)
      }
    }
    fetchTables()
  }, [tables])

  const skeletonArray = Array.from({ length: 14 })

  return (
    <div className="flex h-full flex-1 flex-col justify-between gap-[15px]">
      <div className="flex flex-row gap-[15px]" suppressHydrationWarning>
        <Time />
        <UserAuth />
      </div>

      <div className="flex w-full flex-1 flex-row gap-[15px]">
        <div className="flex h-full w-full flex-col gap-[15px]">
          {tables.length > 0 ? (
            <TableList Tables={tables} />
          ) : (
            <div className="grid max-h-[771px] w-full flex-1 grid-cols-auto-fill-100 items-center gap-[15.5px] overflow-y-auto">
              {skeletonArray.map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[200px] w-[199.5px] bg-[#7b7b85]"
                />
              ))}
            </div>
          )}

          <div className="flex h-[95px] justify-start align-bottom">
            <MenuList />
          </div>
        </div>

        <OrderList />
      </div>
    </div>
  )
}
