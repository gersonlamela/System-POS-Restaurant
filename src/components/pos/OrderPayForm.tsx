import React, { useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '../ui/dialog'
import { Backspace, XCircle } from '@phosphor-icons/react'
import { OrderData } from '@/functions/OrderProvider'

// Componente para o passo de entrada do NIF do cliente
const NifClientFormStep: React.FC<{
  onNextPage: () => void
  defaultNif: string // Valor padrão do NIF
  setNif: React.Dispatch<React.SetStateAction<string>>
}> = ({ onNextPage, defaultNif, setNif }) => {
  const handleNumberClick = (number: string) => {
    if (typeof defaultNif === 'string' && defaultNif.length < 9) {
      setNif((prevNif) => prevNif + number)
    }
  }

  const handleClearNif = () => {
    setNif('')
  }

  const handleNextPage = () => {
    onNextPage()
  }

  return (
    <div className="flex h-[650px] w-[400px] flex-col items-center justify-between rounded-[30px] bg-white px-[50px] py-[20px] shadow-button20">
      <label>NIF do Cliente</label>
      <div className="flex h-[65px] w-full items-end justify-center rounded-[10px] bg-white text-center text-3xl font-semibold text-primary shadow-button10">
        <div className="flex h-full items-center justify-center">
          {defaultNif.padEnd(9)}
        </div>
      </div>
      <div className="grid w-full grid-cols-3 gap-[15px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            className="flex h-[90px] w-[90px] items-center justify-center rounded-[10px] bg-white text-[30px] font-semibold text-third shadow-button10"
            onClick={() => handleNumberClick(number.toString())}
          >
            {number}
          </Button>
        ))}
        <Button
          className="flex h-[90px] w-[90px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-primary shadow-button10"
          onClick={handleClearNif}
        >
          <XCircle size={36} />
        </Button>
        <Button
          className="flex h-[90px] w-[90px] items-center justify-center rounded-[10px] bg-white text-[30px] font-semibold text-third shadow-button10"
          onClick={() => handleNumberClick('0')}
        >
          0
        </Button>
        <Button
          onClick={() => setNif((prevNif) => prevNif.slice(0, -1))}
          className="flex h-[90px] w-[90px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-primary shadow-button10"
        >
          <Backspace size={36} />
        </Button>
      </div>
      <button type="button" onClick={handleNextPage}>
        Próximo
      </button>
    </div>
  )
}

interface PaymentDataProps {
  nif: string
  order: [string, OrderData][]
}

// Componente para o passo de seleção do método de pagamento
function PaymentMethodFormStep({ order, nif }: PaymentDataProps) {
  const [paymentMethod, setPaymentMethod] = useState('CASH')

  const username = order.find(([id, data]) => data.userName)?.[1].userName || ''
  const orderId = order.find(([id, data]) => id)?.[0]
  const data = order.find(([id, data]) => data.createdAt)?.[1].createdAt || ''

  function onSubmit(nif: string) {
    console.log('data', { paymentMethod, nif, username, orderId, data })
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <label className="mb-4 text-xl">NIF do Cliente: {nif}</label>
      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-8 shadow-lg">
        <label className="mb-2 text-lg">Método de Pagamento</label>
        <select
          name="paymentMethod"
          defaultValue={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="h-10 w-64 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="CASH">Dinheiro</option>
          <option value="BANK">Transferência Bancária</option>
        </select>
        <div className="h-[200px] w-full overflow-y-auto">
          {order.map(([id, data]) => (
            <div
              key={id}
              className="mb-4 flex flex-col items-center justify-center rounded-lg bg-gray-100 p-8 shadow-lg"
            >
              {data.products.map((product, index) => (
                <div key={index} className="mb-4 flex flex-col items-start">
                  <span className="mb-2 text-lg font-semibold">
                    Produto: {product.name}
                  </span>
                  <span className="mb-2 text-sm font-semibold">
                    Quantidade: {product.quantity}
                  </span>
                  <span className="mb-2 text-sm font-semibold">
                    Preço unitário: {product.price}
                  </span>
                  {product.ingredients && (
                    <span className="mb-2 text-sm font-semibold">
                      Ingredientes:{' '}
                      {product.ingredients
                        .map((ingredient) => ingredient.name)
                        .join(', ')}
                    </span>
                  )}
                </div>
              ))}
              <label className="mb-2 mt-4 text-lg font-semibold">
                Total: {data.totalPrice}
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={() => onSubmit(nif)}
          className="mt-8 h-12 w-40 rounded-md bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}

interface OrderPayFormProps {
  order: [string, OrderData][]
}

// Componente principal do formulário de pagamento
export function OrderPayForm({ order }: OrderPayFormProps) {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [nif, setNif] = useState<string>('')

  const handleResetPage = () => {
    setCurrentPage(1)
    setNif('')
  }

  const beforePage = () => setCurrentPage(currentPage - 1)
  const nextPage = () => setCurrentPage(currentPage + 1)

  return (
    <Dialog>
      <DialogTrigger
        onClick={handleResetPage}
        asChild
        className="flex cursor-pointer items-center justify-center gap-[14px] text-[#A9A9A9]"
      >
        <Button className="flex h-[50px] w-full items-center justify-center rounded-[30px] bg-primary text-[18px] font-medium text-white shadow">
          Pagar
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[790px] w-[1100px] flex-col gap-4 rounded-md bg-white p-4 shadow-md">
        {currentPage === 1 && (
          <NifClientFormStep
            defaultNif={nif}
            onNextPage={nextPage}
            setNif={setNif}
          />
        )}
        {currentPage === 2 && <PaymentMethodFormStep order={order} nif={nif} />}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>

          {currentPage >= 2 && (
            <button type="button" onClick={beforePage}>
              Recuar
            </button>
          )}

          {currentPage < 2 && (
            <button type="button" onClick={nextPage}>
              Continuar
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
