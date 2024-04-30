/* eslint-disable prettier/prettier */

'use client'
import { useOrder } from '@/functions/OrderProvider';
import { Button } from '../ui/button';
import { OrderItem } from './OrderItem';
import { Pay } from './Pay';
import { useParams } from 'next/navigation';

export function OrderList() {
  const params = useParams<{ tableNumber: string }>();
  const { orders, clearOrdersForTable, subtotal, total, totalDiscount, totalTAX } = useOrder();

  const subtotalTable = subtotal(params.tableNumber);
  const totalTable = total(params.tableNumber);
  const totalDiscountTable = totalDiscount(params.tableNumber);
  const totalTAXTable = totalTAX(params.tableNumber);

  // Filtrar os pedidos que correspondem ao número da mesa
  const filteredOrders = Object.entries(orders).filter(([key]) => key === params.tableNumber);


  const handleClearOrder = (tableNumber: string) => {
    clearOrdersForTable(tableNumber);

    location.href = '/';
  }

  return (
    <div className="flex min-w-[335px] flex-1 flex-col justify-between gap-[15px]">
      <div className="flex flex-col flex-grow bg-LightGray rounded-[10px] p-4 shadow">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-medium text-black">Mesa {params.tableNumber}</h1>
          <Button
            onClick={() => handleClearOrder(params.tableNumber)}
            className="h-8 px-4 bg-white text-primary shadow hover:bg-primary hover:text-white"
          >
            Limpar Tudo
          </Button>
        </div>
        {filteredOrders.length > 0 ? (
          <div style={{ maxHeight: `calc(100vh - 530px)` }} className="overflow-y-scroll">
            {filteredOrders.map(([tableNumber, products], index) => (
              products.products.map((product, productIndex) => (
                <div key={product.orderId}>
                  <OrderItem tableNumber={tableNumber} product={product} orderId={product.orderId || ''} />
                  {index !== filteredOrders.length - 1 || productIndex !== products.products.length - 1 ? (
                    <hr className="my-4 border border-gray-200" />
                  ) : null}
                </div>
              ))
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-grow justify-center items-center font-semibold text-xl">Sem Pedidos</div>
        )}
      </div>

      <div className="h-[180px]">
        <Pay subtotal={subtotalTable} total={totalTable} totalDiscount={totalDiscountTable} tax={totalTAXTable} />
      </div>
    </div>
  );
}


