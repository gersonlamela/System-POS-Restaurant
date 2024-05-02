'use client'

import { ProductList } from '@/components/pos/ProductList'

import { handleGetProducts } from '@/functions/Product/product'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProductWithIngredients } from '@/types/Product'

export default function OrderPage() {
  const [products, setProducts] = useState<ProductWithIngredients[]>([])
  const params = useParams<{ tableNumber: string }>()

  const tableNumber = params.tableNumber

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

  return <ProductList product={products} tableNumber={tableNumber} />
}
