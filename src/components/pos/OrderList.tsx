/* eslint-disable prettier/prettier */
import { useOrder } from '@/functions/OrderProvider'
import { Button } from '../ui/button'

import { OrderItem } from './OrderItem'
import { Pay } from './Pay'
import { useParams } from 'next/navigation'

export function OrderList() {
  const params = useParams<{ tableNumber: string }>()

  const { orders, clearOrdersForTable, subtotal, total, totalDiscount, totalTAX
  } =
    useOrder()

  const subtotalTable = subtotal(params.tableNumber)
  const totalTable = total(params.tableNumber)
  const totalDiscountTable = totalDiscount(params.tableNumber)
  const totalTAXTable = totalTAX(params.tableNumber)


  // Filtrar os pedidos que correspondem ao número da mesa
  const filteredOrders = Object.entries(orders).filter(
    ([key]) => key === params.tableNumber,
  )

  console.log(filteredOrders)

  return (
    <div className="flex  h-full min-w-[335px] flex-col gap-[10px]">
      <div className="flex h-[579px] overflow-scroll w-full flex-col  rounded-[10px] bg-LightGray px-[10px] py-[10px] shadow">
        <div className="flex w-full flex-row justify-between mb-[15px] ">
          <div className="flex w-full flex-row  justify-between">
            <h1 className="font-medium text-black">
              Mesa {params.tableNumber}
            </h1>
          </div>
          <div className='w-full flex flex-row justify-end'>
            <Button
              onClick={() => clearOrdersForTable(params.tableNumber)}
              className="h-[25px] w-[100px] bg-white text-primary shadow hover:bg-primary hover:text-white"
            >
              Limpar Tudo
            </Button>
          </div>
        </div>

        {
          filteredOrders.length > 0 ? (
            filteredOrders.map(([tableNumber, products], index) => (
              products.products.map((product, productIndex) => (
                <div key={product.id}>
                  <OrderItem tableNumber={tableNumber} product={product} />
                  {index !== filteredOrders.length - 1 ||
                    productIndex !== products.products.length - 1 ? (
                    <hr className="my-[10px] border border-gray-200" />
                  ) : null}
                </div>
              ))

            ))
          ) : (
            <div className="h-full flex items-center justify-center text-center font-semibold">Pedido vazio.</div>
          )
        }
      </div >
      <Pay subtotal={subtotalTable} total={totalTable} totalDiscount={totalDiscountTable} tax={totalTAXTable} />
    </div >
  )
}
