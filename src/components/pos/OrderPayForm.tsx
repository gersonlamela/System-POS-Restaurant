/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../ui/dialog'
import { Backspace, Check, CurrencyEur, X, XCircle } from '@phosphor-icons/react'
import { OrderData, useOrder } from '@/functions/OrderProvider'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { Division } from './Division'
import { handleGetCompany } from '@/functions/Company/route'
import { Company } from '@prisma/client'
import { getPayMethodOrder } from '@/functions/Order/order'

import Image from 'next/image'


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

  /*   const handleNextPage = () => {
      onNextPage()
    } */

  return (
    <div className="flex flex-col items-center justify-between">
      <label className='text-[24px] font-bold text-third mb-[51px]'>Fatura c/ contribuinte</label>
      <div className="flex h-[65px]  mb-[20px] w-full items-end justify-center rounded-[10px] text-center text-3xl font-semibold text-primary shadow-button10">
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
    </div>
  )
}

interface PaymentDataProps {
  nif: string
  order: [string, OrderData][]
  methodPayment: string
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setMethodPayment: React.Dispatch<React.SetStateAction<string>>
  setPaymentSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setPaymentError: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderList: React.Dispatch<React.SetStateAction<[string, OrderData][]>>;
  table: string
}

function PaymentMethodFormStep({
  nif,
  order,
  setMethodPayment,
  setPaymentSuccess,
  setLoading,
  setPaymentError,
  setOrderList,
  table,
}: PaymentDataProps) {
  // Extrai informações do pedido
  const username = order.find(([, data]) => data.userName)?.[1].userName || ''
  const totalPrice =
    order.find(([, data]) => data.totalPrice)?.[1].totalPrice || ''
  const products = order.find(([, data]) => data.products)?.[1].products || []
  const { clearOrdersForTable } = useOrder();

  const paymentMethods = [
    { value: 'BANK', label: 'Multibanco', icon: 'multibanco.png', height: 90, width: 76 },
    { value: 'BANK', label: 'Visa', icon: 'Visa.png', height: 121, width: 121 },
    { value: 'BANK', label: 'MbWay', icon: 'mbway.png', height: 120, width: 150 },
    { value: 'BANK', label: 'Apple Pay', icon: 'Apple-Pay.png', height: 125, width: 110 },
    { value: 'CASH', label: 'Dinheiro' },
  ];

  // Função para lidar com o envio do pedido
  async function onSubmit(methodPayment: string) {
    const tableNumber = parseInt(table)

    setMethodPayment(methodPayment)


    setLoading(true)
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
      // Verifica se a solicitação foi bem-sucedida
      if (response.ok) {
        setTimeout(() => {
          setLoading(false)
          setOrderList(order);
          clearOrdersForTable(tableNumber.toString());
          setPaymentSuccess(true);
        }, 2000);

      }
      if (!response.ok) {
        setPaymentError(true);
        throw new Error('Failed to submit order')
      }
    } catch (error) {
      console.error('There was an error', error)
    }
  }



  return (
    <div className="flex flex-col items-center h-full">
      <label className='text-[24px] font-bold text-third mb-[51px]'>Métodos de Pagamento</label>
      <div className="flex max-w-[350px] gap-[50px] flex-row flex-wrap items-center justify-center">
        {/* Seleção do método de pagamento */}

        {paymentMethods.map((method) => (
          <button
            key={method.label}
            type="button"
            className={`border-2 flex items-center justify-center border-third shadow-button5 w-[150px] h-[120px] rounded-[10px] px-4 py-2 focus:outline-none`}
            onClick={() => onSubmit(method.value)}
          >
            {method.icon ? (
              <Image priority src={`/icons/${method.icon}`} alt={method.label} width={method.width} height={method.height} />
            ) : (
              <div className='flex flex-col gap-[15px] items-center justify-center'>
                <CurrencyEur size={50} weight='bold' />
                <span>Numerário</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PaymentMethodFormStep

export const PaymentSuccessPopUp = () => {
  return (
    <div className="absolute flex flex-col gap-[32px] h-full w-full items-center justify-center rounded-[30px] bg-white">
      <div className='w-[235px] animate-bounce  flex items-center justify-center h-[235px] rounded-full bg-[#88E152] border-[20px] border-[#88E152] bg-opacity-50'>
        <Check size={120} className='text-white' weight='bold' />
      </div>
      <h1 className='text-[24px] font-semibold'>Processamento Concluído</h1>
    </div>
  )
}

export const PaymentErrorPopUp = () => {
  return (
    <div className="absolute flex flex-col gap-[32px] h-full w-full items-center justify-center rounded-[30px] bg-white">
      <div className='w-[235px] animate-pulse  flex items-center justify-center h-[235px] rounded-full bg-[#F86E0A] border-[20px] border-[#F86E0A] bg-opacity-50'>
        <X size={120} className='text-white' weight='bold' />
      </div>
      <h1 className='text-[24px] font-semibold'>Processamento Recusado!</h1>
    </div>
  )
}

export const LoadingData = () => {
  return (
    <div className="absolute flex flex-col gap-[32px] h-full w-full items-center justify-center rounded-[30px]  backdrop-blur-[3px]">
      <div className='w-[500px] animate-bounce text-[24px] font-semibold text-white h-[100px] bg-third rounded-[20px] flex items-center justify-center'>
        A processar pagamento...
      </div>
    </div>
  )
}

interface OrderPayFormProps {
  order: [string, OrderData][]
  totalPriceTable: number
}

// Componente principal do formulário de pagamento
export function OrderPayForm({ order, totalPriceTable }: OrderPayFormProps) {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [nif, setNif] = useState<string>('')
  const [amountPay, setAmountPay] = useState<number>(0.0)
  const [methodPayment, setMethodPayment] = useState<string>('BANK')

  const params = useParams<{ tableNumber: string }>()
  const [dataFormatada, setDataFormatada] = useState<string>('')
  const [horaFormatada, setHoraFormatada] = useState<string>('')



  const [PaymentSuccess, setPaymentSuccess] = useState<boolean>(false)
  const [Loading, setLoading] = useState<boolean>(false)

  const [PaymentError, setPaymentError] = useState<boolean>(true)
  const [Receipt, setReceipt] = useState<boolean>(false)

  const [orderList, setOrderList] = useState<[string, OrderData][]>([])


  const totalPrice =
    orderList.find(([, data]) => data.totalPrice)?.[1].totalPrice || ''



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
  }, [order])

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
    setReceipt(false);
    setLoading(false);
    setPaymentSuccess(false);
    setPaymentError(false);
  }
  /*   const beforePage = () => setCurrentPage(currentPage - 1) */
  const nextPage = () => setCurrentPage(currentPage + 1)

  const atendente = orderList.find(([, data]) => data.userName)?.[1].userName || ''
  const primeiroNome = atendente.split(' ')[0] // Primeiro nome
  const segundoNome = atendente.split(' ')[1] // Segundo nome

  const nomeFormatado = `${segundoNome ? primeiroNome + ' ' + segundoNome.charAt(0) : primeiroNome}.` // Pegando a primeira letra do primeiro nome seguida de um ponto

  if (PaymentSuccess) {
    setTimeout(() => {
      setReceipt(true);
      setPaymentSuccess(false);
      setPaymentError(false);
    }, 1000);
  }

  if (PaymentError) {
    setTimeout(() => {
      setReceipt(false);
      setPaymentSuccess(false);
      setPaymentError(false);
    }, 1000);
  }



  console.log(orderList)
  return (
    <Dialog onOpenChange={handleResetPage}>
      <DialogTrigger

        onClick={handleResetPage}
        asChild
        className="flex cursor-pointer items-center justify-center gap-[14px] text-[#A9A9A9]"
      >
        <Button disabled={totalPriceTable === 0} className="flex h-[50px] w-full items-center justify-center rounded-[30px] bg-primary text-[18px] font-medium text-white shadow">
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

        {Loading && <LoadingData />}
        {PaymentError && <PaymentErrorPopUp />}
        {PaymentSuccess && <PaymentSuccessPopUp />}


        <div className="flex min-h-[75px] max-h-[75px]  w-[1100px] items-center justify-center rounded-t-[40px] bg-third text-[32px] font-bold text-white ">
          Pagamento
        </div>
        {!Receipt && (
          <div className={`h-full w-full py-[59px]`}>
            <div className="flex justify-around w-full h-full items-center">

              <NifClientFormStep
                defaultNif={nif}
                onNextPage={nextPage}
                setNif={setNif}
              />

              <div className='w-[2px] h-full bg-secondary' />

              <PaymentMethodFormStep
                setLoading={setLoading}
                setPaymentError={setPaymentError}
                setPaymentSuccess={setPaymentSuccess}
                table={params.tableNumber}
                order={order}
                setOrderList={setOrderList}
                methodPayment={methodPayment}
                setMethodPayment={setMethodPayment}
                nif={nif}
              />

            </div>
          </div>
        )}


        {Receipt && (
          <div className={'flex items-center justify-center'}>
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
                      <div>REF: {orderList.find(([id]) => id)?.[0]}</div>
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
                    {orderList.map(([id, data]) => (
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
                      {orderList.map(([id, data]) => {
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
                          {orderList.map(([id, data]) => {
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
                        {orderList.map(([id, data]) => {
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

            {Receipt && (
              <div className='absolute flex flex-col gap-[15px] right-[30px] bottom-[15px]'>
                <button className='bg-secondary px-8 py-2 rounded-[10px] text-white'>Imprimir</button>
                <DialogClose asChild>
                  <button className='bg-secondary px-8 py-2 rounded-[10px] text-white'>Sair</button>
                </DialogClose>

              </div>
            )}
          </div>
        )}

      </DialogContent>
    </Dialog >
  )
}


