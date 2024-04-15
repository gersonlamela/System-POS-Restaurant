/* eslint-disable prettier/prettier */
import { useOrder } from '@/functions/OrderProvider'
import { Button } from '../ui/button'

import { OrderItem } from './OrderItem'
import { Pay } from './Pay'
import { useParams } from 'next/navigation'

export function OrderList() {
  const params = useParams<{ tableNumber: string }>()

  const { orders, clearOrdersForTable, subtotal, total, totalDiscount } =
    useOrder()

  // Filtrar os pedidos que correspondem ao número da mesa
  const filteredOrders = Object.entries(orders).filter(
    ([key, value]) => key === params.tableNumber,
  )

  return (
    <div className="flex h-full min-w-[335px] flex-col gap-[10px]">
      <div className="flex h-full w-full flex-col gap-[15px] rounded-[10px] bg-LightGray px-[10px] pt-[4px] shadow">
        <div className="flex w-full flex-row justify-between gap-[15px]">
          <div className="flex w-full flex-col items-center justify-between">
            <h1 className="font-medium text-black">
              Pedido #{params.tableNumber}
            </h1>
          </div>
          <div>
            <Button
              onClick={() => clearOrdersForTable(params.tableNumber)}
              className="h-[25px] w-[100px] bg-white text-primary shadow hover:bg-primary hover:text-white"
            >
              Limpar Tudo
            </Button>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          filteredOrders.map(([tableNumber, products], index) => (
            <div key={tableNumber}>
              <h2 className="mb-2 mt-4 font-semibold">Mesa {tableNumber}</h2>

              {products.products.map((product, productIndex) => (
                <div key={product.id}>
                  <OrderItem tableNumber={tableNumber} product={product} />
                  {/* Renderizar hr somente se não for o último item de pedido */}
                  {index !== filteredOrders.length - 1 ||
                    productIndex !== products.products.length - 1 ? (
                    <hr className="my-[10px] border border-gray-200" />
                  ) : null}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center font-semibold">Pedido vazio.</p>
        )}
      </div>
      <Pay />
    </div>
  )
}
