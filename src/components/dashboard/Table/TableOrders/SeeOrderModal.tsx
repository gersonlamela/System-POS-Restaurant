import React, { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Binoculars } from '@phosphor-icons/react'
import { parseISO, format } from 'date-fns'
import { Order } from '@/types/Order'
import { Product } from '@prisma/client'
import { handleGetProducts } from '@/functions/Product/product'
import {
  getPayMethodOrder,
  getStatusOrder,
  getStatusStyleOrder,
} from '@/functions/Order/order'
import Image from 'next/image'

interface SeeOrderModalProps {
  order: Order
}

export default function SeeOrderModal({ order }: SeeOrderModalProps) {
  const [products, setProducts] = React.useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await handleGetProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      }
    }

    fetchProducts()
  }, [])

  if (!order) return null

  const date = parseISO(order.createdAt.toString())

  return (
    <Dialog>
      <DialogTrigger className="flex h-[40px] w-[40px] items-center justify-center rounded-[5px]  border border-third bg-white text-third shadow-button5">
        <Binoculars size={20} />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-background p-4">
        {order ? (
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Ver Pedido #{order.orderId}
            </DialogTitle>
            <hr />
            <DialogDescription className="w-full">
              <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label className="text-black">Id</Label>
                  <Input
                    className="text-black disabled:opacity-100"
                    value={order.id}
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-black">ID</Label>
                  <Input
                    className="text-black disabled:opacity-100"
                    value={order.orderId}
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-black">NIF</Label>
                  <Input
                    className="text-black disabled:opacity-100"
                    value={order.NifClient?.toString() || ''}
                    type="number"
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-black">Mesa</Label>
                  <Input
                    className="text-black disabled:opacity-100"
                    value={order.Table?.number || ''}
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-black">Criado Por</Label>
                  <Input
                    className="text-black disabled:opacity-100"
                    value={order.User?.name || ''}
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-black">Total Pago</Label>
                  <Input
                    className="text-black disabled:opacity-100"
                    value={new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 1,
                    }).format(order.totalPrice)}
                    disabled
                  />
                </div>
                {order.PaymentMethod && (
                  <div>
                    <Label className="text-black">Método de Pagamento</Label>
                    <Input
                      className="text-black disabled:opacity-100"
                      value={getPayMethodOrder(order?.PaymentMethod)}
                      disabled
                    />
                  </div>
                )}
                <div>
                  <Label className="text-black">Criado em</Label>
                  <Input
                    className="text-black disabled:opacity-100"
                    value={date ? format(date, 'dd/MM/yyyy  HH:mm:ss') : ''}
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-black">Estado do Pedido</Label>
                  <div className="flex items-center justify-start gap-2 ">
                    <div
                      className={`h-[10px] w-[10px] rounded-full ${getStatusStyleOrder(
                        order.status,
                      )}`}
                    />
                    {getStatusOrder(order.status)}
                  </div>
                </div>
                <div className="col-span-2 max-h-[300px] overflow-y-auto">
                  {order.OrderProduct.map((orderProduct, index) => (
                    <div key={index} className="mb-4">
                      {products &&
                        products.length > 0 &&
                        (() => {
                          const foundProduct = products.find(
                            (product) => product.id === orderProduct.productId,
                          )
                          if (foundProduct) {
                            return (
                              <div className="mb-2 flex items-center">
                                <Image
                                  src={`/uploads/products/${foundProduct.image}`}
                                  alt={foundProduct.name}
                                  className="mr-3 rounded-full object-contain"
                                  width={60}
                                  height={60}
                                />
                                <p className="text-lg font-bold">
                                  {foundProduct.name}
                                </p>
                              </div>
                            )
                          }
                        })()}
                      <div className="ml-16">
                        {orderProduct.OrderIngredient.map(
                          (orderIngredient, ingredientIndex) => (
                            <div key={ingredientIndex} className="mb-2">
                              {orderIngredient.cookingPreference ? (
                                <p>
                                  {orderIngredient.ingredient.name} -{' '}
                                  {orderIngredient.cookingPreference}
                                </p>
                              ) : (
                                <p>{orderIngredient.ingredient.name}</p>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex w-full justify-end gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-white hover:bg-red-500"
                  >
                    Fechar
                  </Button>
                </DialogClose>
              </div>
            </DialogDescription>
          </DialogHeader>
        ) : (
          <h1>Sem Informações</h1>
        )}
      </DialogContent>
    </Dialog>
  )
}
