import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button' // Certifique-se de ter importado o componente Button corretamente.

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'
import { Binoculars } from '@phosphor-icons/react'

import { getRole } from '@/functions/user/user'
import { parseISO, format } from 'date-fns'
import { Order } from '@/types/Order'
import result from 'postcss/lib/result'

interface SeeOrderModalProps {
  order: Order
}

export default function SeeOrderModal({ order }: SeeOrderModalProps) {
  if (!order) return null

  const parede = order.OrderIngredient.map((product) =>
    console.log('order', product.product),
  )

  const date = parseISO(order.createdAt.toString())

  console.log(format(date, 'dd/MM/yyyy  h:mm a'))
  return (
    <>
      <Dialog>
        <DialogTrigger className="flex items-center justify-center  rounded-lg bg-black px-2 py-2 text-white">
          <Binoculars size={16} weight="bold" />
        </DialogTrigger>
        <DialogContent className="min-w-[630px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Ver Utilizador
            </DialogTitle>
            <hr />
            <DialogDescription className=" w-full ">
              <div className="mt-2 grid w-full grid-cols-2 items-start gap-6">
                <div>
                  <Label className="text-black">Id</Label>
                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={order.id}
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-black">ID</Label>
                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={order.orderId}
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-black">NIF</Label>

                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={order.nif?.toString()}
                    type="number"
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-black">Mesa</Label>

                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={order.Table?.number}
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-black">Criado Por</Label>

                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={order.User?.name?.toString()}
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-black">Ingredients</Label>
                  {Object.values(
                    order.OrderIngredient.reduce(
                      (acc, orderIngredient) => {
                        // Group order ingredients by productId
                        const productId = orderIngredient.product?.id
                        if (!acc[productId]) {
                          acc[productId] = {
                            product: orderIngredient.product,
                            ingredients: [],
                          }
                        }
                        acc[productId].ingredients.push(orderIngredient)
                        return acc
                      },
                      {} as {
                        [key: string]: { product: any; ingredients: any[] }
                      },
                    ),
                  ).map((groupedOrderIngredient, index) => (
                    <div key={index}>
                      <div className="font-bold">
                        {groupedOrderIngredient.product?.name}
                      </div>
                      {groupedOrderIngredient.ingredients.map(
                        (ingredient, ingredientIndex) => (
                          <div key={ingredientIndex}>
                            {ingredient.ingredient.name} = {ingredient.quantity}
                          </div>
                        ),
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <Label className="text-black">Criado em</Label>
                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={date && format(date, 'dd/MM/yyyy  h:mm')}
                    disabled
                  />
                </div>
              </div>
              <div className="flex w-full justify-end gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-white hover:bg-red-500"
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button variant={'outline'}>
                  <span>Editar utilizador</span>
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
