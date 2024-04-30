'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { PencilSimpleLine } from '@phosphor-icons/react'
import { IngredientsProduct } from '@/types/Product'
import { NumberIncrease } from '../dashboard/NumberIncrease'
import { OrderProduct, useOrder } from '@/functions/OrderProvider'

interface IngredientsProductProps {
  ProductIngredient: IngredientsProduct[]
  tableNumber: string // Adicione o número da mesa como uma propriedade
  product: OrderProduct
  orderId?: string
}

export function EditOrderPopUp({
  ProductIngredient,
  tableNumber,
  product,
  orderId,
}: IngredientsProductProps) {
  const [ingredients, setIngredients] = useState<IngredientsProduct[]>([])
  const { updateIngredientQuantity } = useOrder()

  useEffect(() => {
    setIngredients(ProductIngredient)
  }, [ProductIngredient])

  const handleQuantityChange = (
    productId: string,
    ingredientId: string,
    quantity: number,
  ) => {
    // Atualiza a quantidade do ingrediente no estado local
    const newIngredients = ingredients.map((ingredient) =>
      ingredient.id === ingredientId ? { ...ingredient, quantity } : ingredient,
    )

    setIngredients(newIngredients)

    if (orderId) {
      updateIngredientQuantity(
        orderId,
        productId,
        ingredientId,
        quantity,
        tableNumber,
      )
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="flex cursor-pointer items-center justify-center gap-[14px] text-[#A9A9A9]"
      >
        <button>
          <PencilSimpleLine size={20} /> Editar Pedido
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-md">
        <h2 className="text-lg font-semibold">Editar Pedido</h2>
        {product ? (
          <div className="grid grid-cols-3 gap-4">
            {product.ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center justify-between rounded-md border border-gray-200 p-2"
              >
                <h3>{ingredient.name}</h3>
                <NumberIncrease
                  value={ingredient.quantity}
                  onChange={(value) =>
                    handleQuantityChange(product.id, ingredient.id, value)
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>Sem Ingredientes</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
