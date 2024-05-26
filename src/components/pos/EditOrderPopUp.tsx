/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { PencilSimpleLine } from '@phosphor-icons/react'
import { NumberIncrease } from '../dashboard/NumberIncrease'
import {
  OrderIngredient,
  OrderProduct,
  useOrder,
} from '@/functions/OrderProvider'
import Image from 'next/image'
import { Info } from 'lucide-react'

interface IngredientsProductProps {
  ProductIngredient: OrderIngredient[]
  tableNumber: string
  ProductId: OrderProduct['id']
  orderId?: string
}

export function EditOrderPopUp({
  ProductIngredient,
  tableNumber,
  ProductId,
  orderId,
}: IngredientsProductProps) {
  const [cookingPreference, setCookingPreference] = useState<string>('')



  const [ingredients, setIngredients] = useState<OrderIngredient[]>(ProductIngredient)
  console.log(ProductIngredient)
  const { updateIngredientQuantity } = useOrder()

  const handleQuantityChange = (
    productId: string,
    ingredientId: string,
    quantity: number,
    cookingPreference: string,
  ) => {
    const newIngredients = ProductIngredient.map((ingredient) => {
      if (ingredient.id === ingredientId) {
        if (ingredient.name === 'Carne') {
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
    const newIngredients = ProductIngredient.map((ingredient) => {
      if (ingredient.id === ingredientId) {
        if (ingredient.name === 'Carne') {
          return { ...ingredient, cookingPreference: value }
        }
      }
      return ingredient
    })

    setIngredients(newIngredients)


    console.log(orderId,
      productId,
      ingredientId,
      quantity,
      tableNumber,
      value,)

    if (orderId) {
      updateIngredientQuantity(
        orderId,
        productId,
        ingredientId,
        quantity,
        tableNumber,
        value,
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
        {ingredients ? (
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-col items-center justify-center gap-4">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex w-full items-center justify-between gap-[15px] rounded-md border border-gray-200 p-2"
                >
                  <div className="flex flex-row items-center justify-center gap-[15px] ">
                    {ingredient.name === 'Carne' && ingredient.quantity > 0 && (
                      <CookingPreferencePopUp
                        productId={ProductId}
                        ingredientId={ingredient.id}
                        quantity={ingredient.quantity}
                        onPreferenceChange={handleCookingPreferenceChange}
                        initialPreference={ingredient.cookingPreference || ''}
                      />
                    )}
                    <Image
                      src={`/uploads/ingredients/${ingredient.image}`}
                      alt={ingredient.name}
                      width={70}
                      height={70}
                      className="h-[70px] w-[70px] object-contain"
                    />

                    <h3>{ingredient.name}</h3>
                  </div>
                  <NumberIncrease
                    value={ingredient.quantity}
                    onChange={(value) =>
                      handleQuantityChange(
                        ProductId,
                        ingredient.id,
                        value,
                        cookingPreference,
                      )
                    }
                  />
                </div>
              ))}
            </div>
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

interface CookingPreferencePopUpProps {
  productId: string
  ingredientId: string
  quantity: number
  onPreferenceChange: (
    value: string,
    productId: string,
    ingredientId: string,
    quantity: number,
  ) => void
  initialPreference: string
}

const CookingPreferencePopUp: React.FC<CookingPreferencePopUpProps> = ({
  productId,
  ingredientId,
  quantity,
  onPreferenceChange,
  initialPreference,
}) => {
  const preferences = ['Mal Passada', 'Ao Ponto', 'Bem Passada']
  const [selectedPreference, setSelectedPreference] =
    useState<string>(initialPreference)

  const handlePreferenceClick = (preference: string) => {
    setSelectedPreference(preference)
    onPreferenceChange(preference, productId, ingredientId, quantity)
  }

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="flex cursor-pointer items-center justify-center gap-[14px] text-[#A9A9A9]"
      >
        <button className="flex h-[40px] w-[40px] items-center justify-center rounded-full border">
          <Info />
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-md">
        <h2 className="text-lg font-semibold">Editar Preferência da Carne</h2>
        <div className="flex flex-col gap-2">
          {preferences.map((preference) => (
            <button
              key={preference}
              className={`rounded-md border px-4 py-2 ${selectedPreference === preference
                ? 'bg-blue-500 text-white'
                : ''
                }`}
              onClick={() => handlePreferenceClick(preference)}
            >
              {preference}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
