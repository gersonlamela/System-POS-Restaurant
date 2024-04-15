'use client'

import MenuList from '@/components/pos/MenuList'

import { OrderList } from '@/components/pos/OrderList'
import { ProductList } from '@/components/pos/ProductList'
import { TableList } from '@/components/pos/TabeList'

import { Time } from '@/components/pos/Time'
import { UserAuth } from '@/components/pos/UserAuth'
import { handleGetProducts } from '@/functions/Product/product'
import { handleGetTables } from '@/functions/Table/table'
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
  }, [])
  return (
    <div className="flex h-full flex-1 flex-col justify-between gap-[15px]">
      <div className="flex flex-row gap-[15px]" suppressHydrationWarning>
        <Time />
        <UserAuth />
      </div>

      <div className="flex flex-1 flex-row gap-[15px]">
        <TableList Tables={tables} />

        <OrderList />
      </div>

      <div className="flex h-[95px] justify-start align-bottom">
        <MenuList />
      </div>
    </div>
  )
}
