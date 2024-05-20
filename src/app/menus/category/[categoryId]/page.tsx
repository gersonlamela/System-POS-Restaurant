'use client'

import { ProductList } from '@/components/pos/ProductList'
import { handleGetProductsByCategoryId } from '@/functions/Product/product'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ProductWithIngredients } from '@/types/Product'

export default function OrderCategory() {
  const params = useParams<{ categoryId: string }>()

  const [products, setProducts] = useState<ProductWithIngredients[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await handleGetProductsByCategoryId(
          params.categoryId,
        )

        setProducts(fetchedProducts)

        console.log('categorias produtos', fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  return <ProductList product={products} />
}
