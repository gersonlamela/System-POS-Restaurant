'use client'

import MenuList from '@/components/pos/MenuList'
import { OrderList } from '@/components/pos/OrderList'
import { SideBar } from '@/components/pos/SideBar'
import { Time } from '@/components/pos/Time'
import { UserAuth } from '@/components/pos/UserAuth'
import { handleGetProductsCategory } from '@/functions/Product/product'
import { FC, ReactNode, useEffect, useState } from 'react'

interface OrderLayoutProps {
  children: ReactNode
}

const OrderLayout: FC<OrderLayoutProps> = ({ children }) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await handleGetProductsCategory()

        setCategories(fetchedCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])
  return (
    <div className="flex max-h-screen w-full flex-row gap-[15px]  px-[15px] pb-[10px] pt-[15px]">
      <SideBar categories={categories} />

      <div className="flex flex-1 flex-col gap-[15px]">
        <div className="flex max-h-[50px] w-full flex-1 flex-row gap-[15px] ">
          <Time />
          <UserAuth />
        </div>

        <div className="flex  flex-1 flex-col  justify-between gap-[15px]">
          <div className="flex h-full w-full flex-row justify-between">
            <div className="h-full w-full overflow-scroll">{children}</div>
            <div className="flex min-w-[335px] flex-1 ">
              <OrderList />
            </div>
          </div>
          <div className="flex h-[95px] w-full items-center ">
            <MenuList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderLayout
