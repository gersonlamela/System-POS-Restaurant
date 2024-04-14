import { OrderProduct, useOrder } from '@/functions/OrderProvider'
import { Notepad, PencilSimpleLine } from '@phosphor-icons/react'
import { Trash } from 'lucide-react'
import { NumberIncrease } from './NumberIncrease'

interface OrderItemProps {
  product: OrderProduct
  tableNumber: string
}

export function OrderItem({ product, tableNumber }: OrderItemProps) {
  const {
    decreaseProductQuantity,
    increaseProductQuantity,
    removeProductFromOrder,
  } = useOrder()

  const handleDecreaseProductQuantityClick = () => {
    decreaseProductQuantity(product.id, tableNumber)
  }

  const handleIncreaseProductQuantityClick = () => {
    increaseProductQuantity(product.id, tableNumber)
  }

  const handleRemoveProductClick = () => {
    removeProductFromOrder(product.id, tableNumber)
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex w-full flex-row items-center gap-[15px]">
        <div className="h-[70px] w-[70px] rounded-[5px] bg-third"></div>
        <div className="flex flex-col">
          <div className="text-base font-semibold">{product.name}</div>
          <div className="text-[12px] font-semibold">
            {product.price.toFixed(2)}€
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
