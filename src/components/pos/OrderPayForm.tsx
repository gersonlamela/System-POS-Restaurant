/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Backspace, XCircle } from '@phosphor-icons/react'
import { OrderData, useOrder } from '@/functions/OrderProvider'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { Division } from './Division'
import { handleGetCompany } from '@/functions/Company/route'
import { Company } from '@prisma/client'
import { getPayMethodOrder } from '@/functions/Order/order'

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
      <div className="grid w-full grid-cols-3 gap-[10px]">
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
  methodPayment: string
  setMethodPayment: React.Dispatch<React.SetStateAction<string>>
  table: string
}

function PaymentMethodFormStep({
  nif,
  order,
  methodPayment,
  setMethodPayment,
  table,
}: PaymentDataProps) {
  // Extrai informações do pedido
  const username = order.find(([, data]) => data.userName)?.[1].userName || ''
  const totalPrice =
    order.find(([, data]) => data.totalPrice)?.[1].totalPrice || ''
  const products = order.find(([, data]) => data.products)?.[1].products || []

  const { clearOrdersForTable } = useOrder();


  // Função para lidar com o envio do pedido
  async function onSubmit() {
    const tableNumber = parseInt(table)

    if (!nif) {
      nif = '999999999'
    }


    const currentDate = new Date();


    try {
      // Constrói o objeto de dados do pedido
      const orderData = {
        methodPayment,
        nif,
        tableNumber, // Certifique-se de que 'tableNumber' seja uma string ou número
        date: currentDate,
        username,
        totalPrice: parseFloat(totalPrice),
        orders: products.map((product: OrderData['products'][0]) => ({
          productId: product.id,
          quantity: product.quantity,
          ingredients: product.ingredients.map(
            (ingredient: OrderData['products'][0]['ingredients'][0]) => ({
              ingredientId: ingredient.id,
              ...(ingredient.cookingPreference
                ? {
                  cookingPreference: ingredient.cookingPreference,
                }
                : {
                  cookingPreference: '',
                }), // Adiciona cookingPreference apenas se estiver presente
            }),
          ),
        })),
      }
      // Envia o pedido para o servidor
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/order/createOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      console.log(orderData)



      // Verifica se a solicitação foi bem-sucedida
      if (response.ok) {
        clearOrdersForTable(tableNumber.toString());
        location.href = '/';
      }
      if (!response.ok) {
        throw new Error('Failed to submit order')
      }
    } catch (error) {
      console.error('There was an error', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Exibe o NIF do cliente */}
      <label className="mb-4 text-xl">NIF do Cliente: {nif}</label>
      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-8 shadow-lg">
        {/* Seleção do método de pagamento */}
        <label className="mb-2 text-lg">Método de Pagamento</label>
        <select
          name="paymentMethod"
          value={methodPayment}
          onChange={(e) => setMethodPayment(e.target.value)}
          className="h-10 w-64 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="CASH">Dinheiro</option>
          <option value="BANK">Multibanco</option>
        </select>
        {/* Lista de produtos no pedido */}
        <div className="h-[200px] w-full overflow-y-auto">
          {order.map(([id, data]) => (
            <div
              key={id}
              className="mb-4 flex flex-col items-center justify-center rounded-lg bg-gray-100 p-8 shadow-lg"
            >
              {data.products.map((product: any, index: number) => (
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
                  {/* Exibe os ingredientes, se houver */}
                  {product.ingredients && (
                    <span className="mb-2 text-sm font-semibold">
                      Ingredientes:{' '}
                      {product.ingredients
                        .map((ingredient: any) => ingredient.name)
                        .join(', ')}
                    </span>
                  )}
                </div>
              ))}
              {/* Exibe o preço total do pedido */}
              <label className="mb-2 mt-4 text-lg font-semibold">
                Total: {data.totalPrice}
              </label>
            </div>
          ))}
        </div>
        {/* Botão para enviar o pedido */}
        <button
          onClick={onSubmit}
          className="mt-8 h-12 w-40 rounded-md bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}

export default PaymentMethodFormStep

interface OrderPayFormProps {
  order: [string, OrderData][]
  totalPrice: number
}

// Componente principal do formulário de pagamento
export function OrderPayForm({ order, totalPrice }: OrderPayFormProps) {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [nif, setNif] = useState<string>('')
  const [amountPay, setAmountPay] = useState<number>(0.0)
  const [methodPayment, setMethodPayment] = useState<string>('BANK')

  const params = useParams<{ tableNumber: string }>()
  const [dataFormatada, setDataFormatada] = useState<string>('')
  const [horaFormatada, setHoraFormatada] = useState<string>('')

  const [company, setCompany] = useState<Company>()
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const fetchedCompany = await handleGetCompany()
        setCompany(fetchedCompany)
      } catch (error) {
        console.error('Error fetching tables:', error)
      }
    }
    fetchCompany()
  }, [])

  useEffect(() => {
    const dataCompleta = Date.now()

    if (dataCompleta) {
      const data = dataCompleta
      const dataFormatada = format(data, 'dd-MM-yyyy')
      const horaFormatada = format(data, "HH'h'mm")
      setDataFormatada(dataFormatada)
      setHoraFormatada(horaFormatada)
    }
  }, [order])

  const handleResetPage = () => {
    setCurrentPage(1)
    setNif('')
    setMethodPayment('BANK')
    setAmountPay(0.0)
  }

  /*   const beforePage = () => setCurrentPage(currentPage - 1) */
  const nextPage = () => setCurrentPage(currentPage + 1)

  const atendente = order.find(([, data]) => data.userName)?.[1].userName || ''
  const primeiroNome = atendente.split(' ')[0] // Primeiro nome
  const segundoNome = atendente.split(' ')[1] // Segundo nome

  const nomeFormatado = `${segundoNome ? primeiroNome + ' ' + segundoNome.charAt(0) : primeiroNome}.` // Pegando a primeira letra do primeiro nome seguida de um ponto



  return (
    <Dialog>
      <DialogTrigger
        onClick={handleResetPage}
        asChild
        className="flex cursor-pointer items-center justify-center gap-[14px] text-[#A9A9A9]"
      >
        <Button disabled={totalPrice === 0} className="flex h-[50px] w-full items-center justify-center rounded-[30px] bg-primary text-[18px] font-medium text-white shadow">
          Finalizar
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex h-[790px] w-[1100px] flex-col items-center bg-white  pt-0 shadow-md"
        style={{
          borderRadius: '50px',
          paddingTop: '0px',
          border: '0px solid #EAEAEA',
          paddingLeft: '0px',
          paddingRight: '0px',
        }}
      >
        <div className="flex h-[75px] w-[1100px] items-center justify-center rounded-t-[40px] bg-third text-[32px] font-bold text-white ">
          Pagamento
        </div>
        <div className="grid h-full w-full items-center justify-between gap-[10px] pl-[46px] pr-[71px] md:grid-cols-2">
          <div className="flex h-full flex-1 items-center">
            {currentPage === 1 ? (
              <NifClientFormStep
                defaultNif={nif}
                onNextPage={nextPage}
                setNif={setNif}
              />
            ) : (
              <PaymentMethodFormStep
                table={params.tableNumber}
                order={order}
                methodPayment={methodPayment}
                setMethodPayment={setMethodPayment}
                nif={nif}
              />
            )}
          </div>

          <div className="flex w-full items-center justify-end">
            <div className="flex h-[640px] w-[400px] items-center justify-center rounded-[10px] bg-white shadow-button20 ">
              <div className="flex max-h-[589px] w-[323px] flex-col items-center gap-[15px] overflow-y-scroll leading-[17px]">
                <div className="flex flex-col">
                  <h1 className="text-base font-bold text-center">{company?.name}</h1>

                  <h2 className="w-[217px] text-center text-base font-semibold leading-[17px]">
                    {company?.address}
                    <br />
                    Contribuint nº {company?.nif}
                    <br />
                    Telefone: {company?.phone}
                  </h2>
                </div>
                <Division />
                <div className="flex w-full flex-col gap-[10px]">
                  <h1 className="w-full text-center text-base font-semibold">
                    Mesa Nº {params.tableNumber}
                  </h1>

                  <div className="flex w-full flex-row justify-between font-medium leading-[18px]">
                    <div>
                      <div>REF: {order.find(([id]) => id)?.[0]}</div>
                      <div>
                        MESA: {String(params.tableNumber).padStart(2, '0')}
                      </div>
                      <div>Atendente: {nomeFormatado}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div>{dataFormatada}</div>
                      <div>{horaFormatada}</div>
                      <div>Original</div>
                    </div>
                  </div>
                </div>
                <Division />
                <div className="flex w-full flex-row items-start font-medium">
                  <span className="font-semibold">Contribuinte</span>: {nif}
                </div>
                <Division />
                <table className="w-full leading-[17px]">
                  <thead>
                    <tr className="text-left font-semibold">
                      <th>QTD</th>
                      <th className="max-w-[30px]">UN</th>
                      <th className="max-w-[127px]">DESCRICAO</th>
                      <th>IVA</th>
                      <th className="text-right">VALOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.map(([id, data]) => (
                      <React.Fragment key={id}>
                        {data.products.map((product, index) => (
                          <tr key={index} className="font-medium">
                            <td className="">{product.quantity}</td>
                            <td className="">{product.price.toFixed(2)}</td>
                            <td className="max-w-[90px] truncate">
                              {product.name}
                            </td>
                            <td>{product.tax}%</td>
                            <td className="text-right">
                              {(product.quantity * product.price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>

                <Division />
                <div className="flex w-full  justify-between font-medium leading-[17px]">
                  <div className="flex w-full flex-row justify-between">
                    <div>
                      <div className="font-semibold">Taxa</div>
                      {order.map(([id, data]) => {
                        // Calcula os valores únicos de imposto (IVA) para cada ordem
                        const uniqueTaxes: number[] = data.products.reduce(
                          (acc: number[], product) => {
                            if (!acc.includes(product.tax)) {
                              acc.push(product.tax)
                            }
                            return acc
                          },
                          [],
                        )

                        return (
                          <div key={id} className="flex flex-col">
                            {uniqueTaxes.map((tax) => (
                              <div key={tax}>{tax}%</div>
                            ))}
                          </div>
                        )
                      })}

                      <div className="font-medium">Total Incidenciais:</div>
                    </div>

                    <div className="flex flex-row gap-[25px]">
                      <div className="">
                        <div className="flex justify-end font-semibold">
                          IVA
                        </div>
                        <div>
                          {order.map(([id, data]) => {
                            // Inicializa as variáveis para armazenar o total do IVA para cada taxa
                            let totalTax6 = 0
                            let totalTax13 = 0
                            let totalTax23 = 0

                            // Calcula o total do IVA para cada taxa
                            data.products.forEach((product) => {
                              const productPriceWithoutTax =
                                product.price / (1 + product.tax / 100)
                              const productTax =
                                (product.price - productPriceWithoutTax) *
                                product.quantity

                              if (product.tax === 6) {
                                totalTax6 += productTax
                              } else if (product.tax === 13) {
                                totalTax13 += productTax
                              } else if (product.tax === 23) {
                                totalTax23 += productTax
                              }
                            })

                            // Retorna os totais de IVA para cada taxa e o total geral
                            return (
                              <div key={id} className="flex flex-col items-end">
                                {totalTax6 > 0 && (
                                  <div>{totalTax6.toFixed(2)}</div>
                                )}
                                {totalTax13 > 0 && (
                                  <div>{totalTax13.toFixed(2)}</div>
                                )}
                                {totalTax23 > 0 && (
                                  <div>{totalTax23.toFixed(2)}</div>
                                )}
                                <div className="text-right">
                                  {(
                                    totalTax6 +
                                    totalTax13 +
                                    totalTax23
                                  ).toFixed(2)}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold">INCID.</div>
                        {order.map(([id, data]) => {
                          // Calcula o total dos produtos sem o IVA para cada taxa de imposto
                          const totalExcludingTax6 = data.products
                            .filter((product) => product.tax === 6)
                            .reduce(
                              (acc, product) =>
                                acc + (product.price / 1.06) * product.quantity,
                              0,
                            )

                          const totalExcludingTax13 = data.products
                            .filter((product) => product.tax === 13)
                            .reduce(
                              (acc, product) =>
                                acc + (product.price / 1.13) * product.quantity,
                              0,
                            )

                          const totalExcludingTax23 = data.products
                            .filter((product) => product.tax === 23)
                            .reduce(
                              (acc, product) =>
                                acc + (product.price / 1.23) * product.quantity,
                              0,
                            )

                          return (
                            <div key={id}>
                              <div className="flex flex-col items-end">
                                {totalExcludingTax13 > 0 && (
                                  <div>{totalExcludingTax13.toFixed(2)}</div>
                                )}
                                {totalExcludingTax23 > 0 && (
                                  <div>{totalExcludingTax23.toFixed(2)}</div>
                                )}
                                {totalExcludingTax6 > 0 && (
                                  <div>{totalExcludingTax6.toFixed(2)}</div>
                                )}
                              </div>
                              <div className="flex justify-end">
                                {(
                                  totalExcludingTax13 +
                                  totalExcludingTax23 +
                                  totalExcludingTax6
                                ).toFixed(2)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div></div>
                </div>
                <Division />
                <div className="flex w-full flex-row justify-between font-semibold">
                  <div className="font-semibold ">TOTAL:</div>
                  <div>Eur {totalPrice}</div>
                </div>
                <Division />
                <div className="flex w-full flex-col leading-[18px] ">
                  <div className="font-semibold">Pago em  {methodPayment && getPayMethodOrder(methodPayment)}</div>
                  <div className="flex w-full flex-row justify-between font-medium">
                    <div>
                      <div>Valor Entregue</div>
                      <div>Troco</div>
                    </div>
                    <div className="font-medium">
                      <div>{amountPay.toFixed(2)}</div>
                      <div>0.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*      <DialogFooter>
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
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
