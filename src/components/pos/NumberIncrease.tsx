import { Minus, Plus } from '@phosphor-icons/react/dist/ssr'
import { useState, useEffect } from 'react'

export function NumberIncrease({
  decreaseProductQuantity,
  increaseProductQuantity,
  productId,
  quantity,
  tableNumber,
  orderId,
}: {
  decreaseProductQuantity: (
    orderId: string,
    productId: string,
    tableNumber: string,
  ) => void
  increaseProductQuantity: (
    orderId: string,
    productId: string,
    tableNumber: string,
  ) => void
  productId: string
  quantity: number
  tableNumber: string
  orderId?: string
}) {
  const [value, setValue] = useState(quantity)

  // Sincroniza o estado local com a propriedade quantity
  useEffect(() => {
    setValue(quantity)
  }, [quantity])

  if (!orderId) {
    return null
  }

  const decrement = () => {
    if (value > 1) {
      // Verifica se o valor é maior que 1 antes de decrementar
      setValue(value - 1)
      decreaseProductQuantity(orderId, productId, tableNumber)
    }
  }

  const increment = () => {
    setValue(value + 1)
    increaseProductQuantity(orderId, productId, tableNumber)
  }

  return (
    <div className="flex w-[139px] flex-row items-center gap-[7px]">
      <div
        onClick={decrement}
        className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white text-primary shadow hover:bg-primary hover:text-white"
      >
        <Minus size={16} weight="bold" />
      </div>
      <div className="flex h-[35px] w-[55px] items-center justify-center rounded-full bg-white font-semibold text-black shadow">
        {value}
      </div>
      <div
        onClick={increment}
        className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white text-primary shadow hover:bg-primary hover:text-white"
      >
        <Plus size={16} weight="bold" />
      </div>
    </div>
  )
}
