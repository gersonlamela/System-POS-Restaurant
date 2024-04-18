'use client'

import MenuList from '@/components/pos/MenuList'

import { OrderList } from '@/components/pos/OrderList'
import { ProductList } from '@/components/pos/ProductList'

import { Time } from '@/components/pos/Time'
import { UserAuth } from '@/components/pos/UserAuth'
import {
  handleGetProducts,
  handleGetProductsCategory,
} from '@/functions/Product/product'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { SideBar } from '@/components/pos/SideBar'

export default function OrderPage() {
  const [products, setProducts] = useState([])
  const params = useParams<{ tableNumber: string }>()

  const tableNumber = params.tableNumber

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedCategories = await handleGetProductsCategory()

        setCategories(fetchedCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchProducts()
  }, [])
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
    <div className="flex w-full flex-row gap-[15px]">
      <SideBar categories={categories} />

      <div className="flex h-full flex-1 flex-col   gap-[15px]">
        <div className="flex max-h-[50px] w-full flex-1 flex-row gap-[15px]">
          <Time />
          <UserAuth />
        </div>

        <div className="flex h-full flex-1 flex-col  justify-between gap-[15px]">
          <div className="flex h-full  flex-row gap-[15px]">
            <div className="flex flex-1">
              <ProductList Products={products} tableNumber={tableNumber} />
            </div>
            <div className="min-w-[335px]">
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
