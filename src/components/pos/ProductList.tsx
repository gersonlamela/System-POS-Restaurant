'use client'

import {
  getTax,
  handleGetCategoryByCategoryId,
} from '@/functions/Product/product'
import { useOrder } from '@/functions/OrderProvider'

import { ProductCategory } from '@prisma/client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ProductWithIngredients } from '@/types/Product'
import { useRouter } from 'next/navigation'

interface ProductListProps {
  product: ProductWithIngredients[]
  tableNumber?: string // Adicione o número da mesa como uma propriedade
}

export function ProductList({ product, tableNumber }: ProductListProps) {
  return (
    <div className="flex max-h-[70vh] flex-wrap content-start items-stretch justify-center gap-[15px] overflow-y-scroll lg:justify-start ">
      {product ? (
        product.map((product, index) => (
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
  product: ProductWithIngredients // Alterado para acessar diretamente a propriedade 'product'
  tableNumber?: string
}

const ProductItem = ({ product, tableNumber }: ProductItemProps) => {
  const { addProductToOrder, createEmptyOrderForTable, orders } = useOrder()
  const [category, setCategory] = useState<ProductCategory>()

  const route = useRouter()
  const handleAddToOrder = () => {
    if (tableNumber) {
      if (!orders[tableNumber]) {
        createEmptyOrderForTable(tableNumber)
      }

      const price =
        product.price *
        (1 - (product.discount || 0) / 100) *
        (1 + getTax(product.tax) / 100)

      const priceWithoutDiscount =
        product.price * (1 + getTax(product.tax) / 100)

      const { id, name, image, tax } = product

      const newProduct = {
        id,
        name,
        price,
        tax: getTax(tax),
        priceWithoutDiscount,
        quantity: 1,
        note: '',
        image,
        ingredients: product.ProductIngredient.map((ingredient) => ({
          id: ingredient.ingredient.id,
          name: ingredient.ingredient.name,
          image: ingredient.ingredient.image,
          quantity: ingredient.quantity,
        })),
      }

      console.log('produto', newProduct) // Verifique se os dados do novo produto estão corretos

      addProductToOrder(newProduct, tableNumber)
    } else {
      route.replace('/')
    }
  }

  const productPriceWithTax = product.price * (1 + getTax(product.tax) / 100)

  useEffect(() => {
    const fetchCategory = async () => {
      if (product.id) {
        try {
          const fetchedCategory = await handleGetCategoryByCategoryId(
            product.id,
          )
          setCategory(fetchedCategory)
        } catch (error) {
          console.error('Error fetching tables:', error)
        }
      }
    }
    fetchCategory()
  }, [product.id])

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
              src={`/uploads/products/${product.image}`}
              alt={product.name}
              className="object-contain"
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
