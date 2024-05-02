import { Button } from '../ui/button'

interface PayProps {
  subtotal: number
  total: number
  totalDiscount: number
  tax: number
}

export function Pay({ subtotal, total, totalDiscount, tax }: PayProps) {
  return (
    <div className="flex h-[180px] w-full flex-col gap-[10px] ">
      <div className="flex min-h-[82px] w-full flex-col justify-between rounded-[10px] bg-secondary px-[10px] py-[5px] shadow ">
        <div className="flex w-full flex-row justify-between">
          <span className="text-[14px] font-semibold text-white">SubTotal</span>
          <span className="text-[14px] font-semibold text-white">
            {subtotal ? subtotal.toFixed(2) : 0}€
          </span>
        </div>
        <div className="flex w-full flex-row justify-between">
          <span className="text-[14px] font-normal text-white">Desconto</span>
          <span className="text-[14px] font-normal text-white">
            {totalDiscount ? totalDiscount.toFixed(2) : 0}€
          </span>
        </div>
        <div className="flex w-full flex-row justify-between">
          <span className="text-[14px] font-normal text-white">Iva</span>
          <span className="text-[14px] font-normal text-white">
            {tax ? tax.toFixed(2) : 0}€
          </span>
        </div>
      </div>

      <div className="flex h-[28px] w-full flex-row items-center justify-between rounded-[10px] bg-secondary px-[10px] shadow ">
        <span className="text-[14px] font-semibold text-white">Total</span>
        <span className="text-[14px] font-semibold text-white">
          {total ? total.toFixed(2) : 0}€
        </span>
      </div>

      <Button className="flex h-[50px] w-full items-center justify-center rounded-[30px] bg-primary text-[18px] font-medium text-white shadow">
        Pagar
      </Button>
    </div>
  )
}
