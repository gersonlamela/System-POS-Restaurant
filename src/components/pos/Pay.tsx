'use client'

import { OrderData } from '@/functions/OrderProvider'
import { OrderPayForm } from './OrderPayForm'

interface PayProps {
  subtotal: number
  total: number
  totalDiscount: number
  tax: number
  tableNumber: string
  order: [string, OrderData][]
}

export function Pay({ subtotal, total, totalDiscount, tax, order }: PayProps) {
  return (
    <div className="flex h-[180px] w-full flex-col gap-[10px] ">
      <div className="flex min-h-[82px] w-full flex-col justify-between rounded-[10px] bg-secondary px-[10px] py-[5px] shadow ">
        <div className="flex w-full flex-row justify-between">
          <span className="text-[14px] font-semibold text-white">SubTotal</span>
          <span className="text-[14px] font-semibold text-white">
            {subtotal !== 0 ? subtotal.toFixed(2) : 0}€
          </span>
        </div>
        <div className="flex w-full flex-row justify-between">
          <span className="text-[14px] font-normal text-white">Desconto</span>
          <span className="text-[14px] font-normal text-white">
            {totalDiscount !== 0 ? totalDiscount.toFixed(2) : 0}€
          </span>
        </div>
        <div className="flex w-full flex-row justify-between">
          <span className="text-[14px] font-normal text-white">Iva</span>
          <span className="text-[14px] font-normal text-white">
            {tax !== 0 ? tax.toFixed(2) : 0}€
          </span>
        </div>
      </div>

      <div className="flex h-[28px] w-full flex-row items-center justify-between rounded-[10px] bg-secondary px-[10px] shadow ">
        <span className="text-[14px] font-semibold text-white">Total</span>
        <span className="text-[14px] font-semibold text-white">
          {total !== 0 ? total.toFixed(2) : 0}€
        </span>
      </div>

      <OrderPayForm order={order} totalPriceTable={total} />
    </div>
  )
}
