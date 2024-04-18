'use client'

import {
  getTax,
  handleGetCategoryByCategoryId,
  handleGetProductsByCategoryId,
  handleGetProductsCategory,
} from '@/functions/Product/product'
import { useOrder } from '@/functions/OrderProvider'

import { Product, ProductCategory } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ProductListProps {
  Products: Product[]
  tableNumber: string // Adicione o número da mesa como uma propriedade
}

export function ProductList({ Products, tableNumber }: ProductListProps) {
  return (
    <div className="grid max-h-[771px] w-full grid-cols-auto-fill-100 justify-items-center gap-[15.5px]  overflow-y-auto">
      {Products ? (
        Products.map((product, index) => (
          <ProductItem
            key={index}
            product={product}
            tableNumber={tableNumber}
          />
        ))
      ) : (
        <h1>Sem Produtos</h1>
      )}
    </div>
  )
}

interface ProductItemProps {
  product: Product
  tableNumber: string
}

const ProductItem = ({ product, tableNumber }: ProductItemProps) => {
  const { addProductToOrder, createEmptyOrderForTable, orders } = useOrder()
  const [category, setCategory] = useState<ProductCategory>()

  const handleAddToOrder = () => {
    if (!orders[tableNumber]) {
      createEmptyOrderForTable(tableNumber)
    }

    const price =
      product.price *
      (1 - (product.discount || 0) / 100) *
      (1 + getTax(product.tax) / 100)

    const priceWithoutDiscount = product.price * (1 + getTax(product.tax) / 100)

    const { id, name, image } = product
    const newProduct = {
      id,
      name,
      price,
      priceWithoutDiscount,
      quantity: 1,
      image,
    }

    addProductToOrder(newProduct, tableNumber)
  }

  const productPriceWithTax = product.price * (1 + getTax(product.tax) / 100)

  useEffect(() => {
    const fetchCategory = async () => {
      if (product.id) {
        try {
          const fetchedCategory = await handleGetCategoryByCategoryId(
            product?.id,
          )
          setCategory(fetchedCategory)
        } catch (error) {
          console.error('Error fetching tables:', error)
        }
      }
    }
    fetchCategory()
  }, [])

  console.log(category)

  return (
    <div
      className="relative flex max-h-[200px] min-h-[200px] min-w-[199.5px] max-w-[199.5px] cursor-pointer flex-col items-center justify-between"
      onClick={handleAddToOrder}
    >
      <div className="relative flex h-full w-full ">
        <div className="flex flex-1">
          {category?.name && (
            <Image
              width={199.5}
              height={199.5}
              src={`/uploads/products/${category?.name.replace(
                /\s+/g,
                '',
              )}/${product.image}`}
              alt={product.name}
              priority
            />
          )}
        </div>
        <div className="absolute inset-0 top-[8.75rem] flex flex-col bg-black bg-opacity-30 pb-[10px] pl-[15px] pt-[8px]">
          <span className="text-base font-semibold text-white">
            {product.name}
          </span>
          <span className="text-[12px] font-semibold text-white">
            {new Intl.NumberFormat('pt-PT', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 1,
            }).format(productPriceWithTax)}
          </span>
        </div>
      </div>
    </div>
  )
}
