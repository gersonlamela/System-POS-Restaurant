import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { PencilSimpleLine } from '@phosphor-icons/react'
import { IngredientsProduct } from '@/types/Product'
import { NumberIncrease } from '../dashboard/NumberIncrease'
import { OrderProduct, useOrder } from '@/functions/OrderProvider'
import Image from 'next/image'

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
  const [cookingPreference, setCookingPreference] = useState<string>('')
  const { updateIngredientQuantity } = useOrder()

  useEffect(() => {
    setIngredients(ProductIngredient)
  }, [ProductIngredient])

  const handleQuantityChange = (
    productId: string,
    ingredientId: string,
    quantity: number,
    cookingPreference: string,
  ) => {
    const newIngredients = ingredients.map((ingredient) => {
      if (ingredient.id === ingredientId) {
        // Verifica se o ingrediente é carne e atualiza sua preferência de cozimento
        if (ingredient.ingredient.name === 'Carne') {
          return { ...ingredient, quantity, cookingPreference }
        } else {
          return { ...ingredient, quantity }
        }
      }
      return ingredient
    })

    setIngredients(newIngredients)

    if (orderId) {
      updateIngredientQuantity(
        orderId,
        productId,
        ingredientId,
        quantity,
        tableNumber,
        cookingPreference,
      )
    }
  }

  const handleCookingPreferenceChange = (
    value: string,
    productId: string,
    ingredientId: string,
    quantity: number,
  ) => {
    setCookingPreference(value)
    if (orderId) {
      updateIngredientQuantity(
        orderId,
        productId, // Certifique-se de ter a variável productId disponível aqui
        ingredientId, // Certifique-se de ter a variável ingredientId disponível aqui
        quantity, // Certifique-se de ter a variável quantity disponível aqui
        tableNumber,
        value, // Use o valor atualizado de cookingPreference
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
          <>
            <div className="grid grid-cols-2 gap-4">
              {product.ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between rounded-md border border-gray-200 p-2"
                >
                  <h3>{ingredient.name}</h3>
                  <NumberIncrease
                    value={ingredient.quantity}
                    onChange={(value) =>
                      handleQuantityChange(
                        product.id,
                        ingredient.id,
                        value,
                        cookingPreference,
                      )
                    }
                  />
                </div>
              ))}
            </div>
            {product.ingredients.map(
              (ingredient) =>
                ingredient.name === 'Carne' &&
                ingredient.quantity > 0 && (
                  <div
                    key={ingredient.id}
                    className="flex max-h-[100px] w-full items-center justify-center"
                  >
                    {/* Substitua o select pelas imagens correspondentes */}
                    <div className="flex justify-between gap-[15px]">
                      <button
                        className={`rounded-lg p-2 ${cookingPreference === 'bem passada' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                        onClick={() =>
                          handleCookingPreferenceChange(
                            'bem passada',
                            product.id,
                            ingredient.id,
                            ingredient.quantity,
                          )
                        }
                      >
                        <Image
                          src="/tipos-de-carnes/carne-bem-passada.png"
                          alt="Carne Bem Passada"
                          width={100}
                          height={100}
                        />
                        <span className="text-sm">Bem Passada</span>
                      </button>

                      <button
                        className={`rounded-lg p-2 ${cookingPreference === 'média' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                        onClick={() =>
                          handleCookingPreferenceChange(
                            'média',
                            product.id,
                            ingredient.id,
                            ingredient.quantity,
                          )
                        }
                      >
                        <Image
                          src="/tipos-de-carnes/carne-media.png"
                          alt="Carne Média"
                          width={100}
                          height={100}
                        />
                        <span className="text-sm">Média</span>
                      </button>
                      <button
                        className={`rounded-lg p-2 ${cookingPreference === 'mal passada' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                        onClick={() =>
                          handleCookingPreferenceChange(
                            'mal passada',
                            product.id,
                            ingredient.id,
                            ingredient.quantity,
                          )
                        }
                      >
                        <Image
                          src="/tipos-de-carnes/carne-mal-passada.png"
                          alt="Carne Mal Passada"
                          width={100}
                          height={100}
                        />

                        <span className="text-sm">Mal Passada</span>
                      </button>
                    </div>
                  </div>
                ),
            )}
          </>
        ) : (
          <div>
            <p>Sem Ingredientes</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
