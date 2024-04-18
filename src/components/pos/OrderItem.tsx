/* eslint-disable prettier/prettier */

'use client'
import { OrderProduct, useOrder } from '@/functions/OrderProvider'
import { Notepad, PencilSimpleLine } from '@phosphor-icons/react'
import { Trash } from 'lucide-react'
import { NumberIncrease } from './NumberIncrease'
import { ProductCategory } from '@prisma/client'
import { useEffect, useState } from 'react'
import { handleGetCategoryByCategoryId } from '@/functions/Product/product'
import Image from 'next/image'

interface OrderItemProps {
  product: OrderProduct
  tableNumber: string
}

export function OrderItem({ product, tableNumber }: OrderItemProps) {
  const [category, setCategory] = useState<ProductCategory>()
  const {
    decreaseProductQuantity,
    increaseProductQuantity,
    removeProductFromOrder,
  } = useOrder()

  const handleRemoveProductClick = () => {
    removeProductFromOrder(product.id, tableNumber)
  }

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



  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex w-full flex-row items-center gap-[15px]">
        <div className="h-[70px] w-[70px] rounded-[5px] ">
          {category?.name && (
            <Image
              width={70}
              height={70}
              src={`/uploads/products/${category?.name.replace(/\s+/g, '')}/${product.image}`}
              alt={product.name}
              className="h-[70px] w-[70px] object-fill"

              priority
            />
          )}
        </div>
        <div className="flex flex-col">
          <div className="text-base font-semibold">{product.name}</div>
          <div className="flex gap-[5px] text-[12px] font-semibold">
            {product.price.toFixed(2)}€
            {product.priceWithoutDiscount &&
              product.priceWithoutDiscount !== product.price ? (
              <span
                className="text-[10px] font-semibold text-primary"
                style={{ textDecoration: 'line-through' }}
              >
                {product.priceWithoutDiscount.toFixed(2)}€
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-between">
        <div className="flex items-center justify-center gap-[14px] text-[#A9A9A9]">
          <Notepad size={20} /> Add Nota
        </div>
        <div className="h-full border border-l-2 border-[#ECEDED]"></div>
        <div className="flex items-center justify-center gap-[14px] text-[#A9A9A9]">
          <PencilSimpleLine size={20} /> Editar Pedido
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <NumberIncrease
          tableNumber={tableNumber}
          decreaseProductQuantity={decreaseProductQuantity}
          increaseProductQuantity={increaseProductQuantity}
          productId={product.id}
          quantity={product.quantity}
        />
        <div
          onClick={() => handleRemoveProductClick()}
          className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white text-primary shadow hover:bg-primary hover:text-white"
        >
          <Trash size={16} className="" />
        </div>
      </div>
    </div>
  )
}
