'use client'

import MenuList from '@/components/pos/MenuList'
import { ProductList } from '@/components/pos/ProductList'
import { SideBar } from '@/components/pos/SideBar'
import { Time } from '@/components/pos/Time'
import { UserAuth } from '@/components/pos/UserAuth'
import {
  handleGetProductsByCategoryId,
  handleGetProductsCategory,
} from '@/functions/Product/product'
import { handleGetTableById } from '@/functions/Table/table'
import { Table } from '@prisma/client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Order from '../page'
import { OrderList } from '@/components/pos/OrderList'

interface OrderCategoryProps {
  tableId: string
}

export default function OrderCategory({ tableId }: OrderCategoryProps) {
  const params = useParams<{ categoryId: string }>()

  const [products, setProducts] = useState([])

  const [tableNumber, setTableNumber] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await handleGetProductsByCategoryId(
          params.categoryId,
        )

        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="flex h-full flex-1 flex-col justify-between gap-[15px]">
      <div className="flex flex-row gap-[15px]" suppressHydrationWarning>
        <Time />
        <UserAuth />
      </div>

      <div className="flex flex-1 flex-row gap-[15px]">
        <ProductList Products={products} tableNumber={tableNumber} />

        <OrderList tableNumber={tableNumber} />
      </div>

      <div className="flex h-[95px] justify-start align-bottom">
        <MenuList />
      </div>
    </div>
  )
}
