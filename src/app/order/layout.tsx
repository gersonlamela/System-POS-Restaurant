'use client'
import { Footer } from '@/components/pos/Footer'
import { Header } from '@/components/pos/Header'
import { SideBar } from '@/components/pos/SideBar'
import { handleGetProductsCategory } from '@/functions/Product/product'

import { ReactNode, useEffect, useState } from 'react'

interface ORDERLayoutProps {
  children: ReactNode
}

export default function ORDERLayout({ children }: ORDERLayoutProps) {
  const [products, setProducts] = useState([])
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
  return (
    <div className="max-w-screen flex h-screen flex-col">
      <Header />
      <main className="flex flex-1 overflow-auto border border-red-500 px-[15px] pb-[10px] pt-[15px]">
        <div className="flex flex-1 flex-row gap-[15px]">
          <SideBar categories={categories} />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
