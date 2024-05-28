/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../ui/dialog'
import { PencilSimpleLine } from '@phosphor-icons/react'
import { NumberIncrease } from '../dashboard/NumberIncrease'
import {
  OrderIngredient,
  OrderProduct,
  useOrder,
} from '@/functions/OrderProvider'
import Image from 'next/image'


interface IngredientsProductProps {
  ProductIngredient: OrderIngredient[]
  tableNumber: string
  ProductId: OrderProduct['id']
  Product: OrderProduct
  orderId?: string
}

export function EditOrderPopUp({
  ProductIngredient,
  tableNumber,
  Product,
  ProductId,
  orderId,
}: IngredientsProductProps) {
  const [cookingPreference, setCookingPreference] = useState<string>('')

  const [ingredients, setIngredients] = useState<OrderIngredient[]>(ProductIngredient)
  const { updateIngredientQuantity, } = useOrder()

  const handleQuantityChange = (
    productId: string,
    ingredientId: string,
    quantity: number,
    cookingPreference: string,
  ) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) => {
        if (ingredient.id === ingredientId) {
          if (ingredient.name === 'Carne') {
            return { ...ingredient, quantity, cookingPreference };
          } else {
            return { ...ingredient, quantity };
          }
        }
        return ingredient;
      })
    );

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
    setCookingPreference(value);

    // Use a função de atualização de estado baseada no estado anterior para garantir imutabilidade
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) => {
        if (ingredient.id === ingredientId) {
          if (ingredient.name === 'Carne') {
            return { ...ingredient, cookingPreference: value };
          }
        }
        return ingredient;
      })
    );

    if (orderId) {
      updateIngredientQuantity(
        orderId,
        productId,
        ingredientId,
        quantity,
        tableNumber,
        value,
      );
    }
  };

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
      <DialogContent className="w-[400px] h-[650px] rounded-[30px] bg-white shadow-md" style={{ paddingTop: '22px', paddingLeft: '27px', paddingRight: '24px', borderRadius: '30px' }}>
        <div className='w-full bg-LightGray h-[65px]  rounded-t-[30px] absolute'  ></div>
        <div className='flex flex-col  z-50 gap-[15px] text-[20px] font-semibold'>
          <div className='flex flex-row  gap-[10px]'>
            <div>
              <Image
                width={85}
                height={85}
                src={`/uploads/products/${Product.image}`}
                alt={Product.name}
                className="h-[85px] w-[85px] object-contain rounded-[5px]"
              />
            </div>

            <div className='h-full flex items-end'>{Product.name}</div>
          </div>

          {ingredients ? (
            <div className="flex flex-col items-center h-[440px] overflow-y-auto w-full pl-[24px] gap-[10px]">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex w-full items-center justify-between"
                >
                  {ingredient.name === 'Carne' && ingredient.quantity > 0 && (
                    <div className='absolute left-[14px]'>
                      <CookingPreferencePopUp
                        productName={Product.name}
                        productId={ProductId}
                        ingredientId={ingredient.id}
                        quantity={ingredient.quantity}
                        onPreferenceChange={handleCookingPreferenceChange}
                        initialPreference={ingredient.cookingPreference || ''}
                      />
                    </div>
                  )}

                  <div className="flex flex-row items-center justify-center gap-[15px] ">

                    <Image
                      src={`/uploads/ingredients/${ingredient.image}`}
                      alt={ingredient.name}
                      width={40}
                      height={40}
                      className="h-[40px] w-[40px] object-contain"
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
          ) : (
            <div>
              <p>Sem Ingredientes</p>
            </div>
          )}
        </div>
        <DialogClose className='w-[175px] h-[55px] bg-secondary mx-auto left-0 right-0 text-white rounded-[10px] text-[20px] font-semibold absolute bottom-[27px] z-[50]'>Guardar</DialogClose>
        <div className='w-full bottom-0 bg-LightGray h-[65px]  rounded-b-[30px] absolute'  >

        </div>
      </DialogContent>
    </Dialog>
  )
}

interface CookingPreferencePopUpProps {
  productId: string
  ingredientId: string
  quantity: number
  productName: string
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
  productName,
  ingredientId,
  quantity,
  onPreferenceChange,
  initialPreference,
}) => {
  const preferences = [
    { title: 'Mal', image: 'carne-mal-passada.jpg' },
    { title: 'Médio', image: 'carne-media.jpg' },
    { title: 'Bem', image: 'carne-bem-passada.jpg' }
  ];

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [selectedPreference, setSelectedPreference] =
    useState<string>(initialPreference)

  const handlePreferenceClick = (preference: string) => {
    setSelectedPreference(preference)
    onPreferenceChange(preference, productId, ingredientId, quantity)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        asChild
        className="flex cursor-pointer items-center justify-center gap-[14px] text-[#A9A9A9]"
      >
        <button className="flex h-[26px] w-[26px] text-base font-normal text-primary  items-center justify-center rounded-full shadow-button10 shadow-primary">
          i
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center w-[315px] h-[200px] gap-4 rounded-md bg-white p-4 shadow-md " style={{ paddingTop: '50px', paddingBottom: '30px', borderRadius: '30px' }}>
        <div className='flex items-center justify-center flex-row w-full gap-[15px] h-[50px] bg-third absolute left-0 top-0 rounded-t-[20px]'>
          <h2 className="text-[20px] text-white font-semibold">{productName}</h2>
          <button className="flex h-[26px] w-[26px] bg-white text-base font-normal text-primary  items-center justify-center rounded-full shadow-button10 shadow-primary">
            i
          </button>
        </div>
        <div className="flex items-center flex-1 justify-center flex-row gap-[30px]">
          {preferences.map((preference, index) => (
            <button
              key={index}
              className={`flex flex-col items-center justify-center w-[65px] h-[95px] ${selectedPreference === preference.title
                ? 'shadow-primary shadow-button5'
                : ''
                }`}
              onClick={() => handlePreferenceClick(preference.title)}
            >
              <Image
                src={`/tipos-de-carnes/${preference.image}`}
                alt={preference.title}
                width={65}
                height={65}
                className="h-[65px] w-[65px] object-contain"
              />
              <span className='text-third text-[20px] font-normal'>{preference.title}</span>
            </button>
          ))}
        </div>
        <div className='flex items-center justify-center flex-row w-full gap-[15px] h-[30px] bg-third absolute left-0 bottom-0 rounded-b-[20px]' />
      </DialogContent>
    </Dialog>
  )
}
