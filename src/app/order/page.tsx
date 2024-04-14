'use client'

import MenuList from '@/components/pos/MenuList'

import { OrderList } from '@/components/pos/OrderList'
import { ProductList } from '@/components/pos/ProductList'
import { SideBar } from '@/components/pos/SideBar'
import { Time } from '@/components/pos/Time'
import { UserAuth } from '@/components/pos/UserAuth'
import {
  handleGetProductsCategory,
  handleGetProducts,
} from '@/functions/Product/product'
import { useState, useEffect } from 'react'

interface OrderProps {
  tableNumber: string
}

export default function Order({ tableNumber }: OrderProps) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await handleGetProducts()

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
