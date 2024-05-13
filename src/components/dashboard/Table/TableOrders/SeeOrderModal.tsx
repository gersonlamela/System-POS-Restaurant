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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Binoculars } from '@phosphor-icons/react'
import { parseISO, format } from 'date-fns'
import { Order } from '@/types/Order'
import { OrderIngredient } from '@prisma/client'

interface Ingredient {
  id: string
  name: string
  // Outras propriedades do ingrediente, se houver
}

interface Product {
  id: string
  name: string
  // Outras propriedades do produto, se houver
}

interface GroupedOrderIngredient {
  product: Product
  ingredients: Ingredient[]
}

interface SeeOrderModalProps {
  order: Order
}

export default function SeeOrderModal({ order }: SeeOrderModalProps) {
  if (!order) return null

  const date = parseISO(order.createdAt.toString())

  // Função para agrupar os ingredientes por produto
  const groupIngredients = (orderIngredients: OrderIngredient[]) =>
    orderIngredients.reduce((acc: GroupedOrderIngredient[], curr) => {
      const existingProductIndex = acc.findIndex(
        (group) => group.product.id === curr.product.id,
      )

      if (existingProductIndex !== -1) {
        acc[existingProductIndex].ingredients.push(curr.ingredient)
      } else {
        acc.push({
          product: curr.product,
          ingredients: [curr.ingredient],
        })
      }

      return acc
    }, [])

  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center rounded-lg bg-black px-2 py-2 text-white">
        <Binoculars size={16} weight="bold" />
      </DialogTrigger>
      <DialogContent className="min-w-[630px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center">
            Ver Utilizador
          </DialogTitle>
          <hr />
          <DialogDescription className="w-full">
            <div className="mt-2 grid grid-cols-2 gap-6">
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
                <Label className="text-black">Ingredients</Label>
                {groupIngredients(order.OrderIngredient).map(
                  (groupedOrderIngredient, index) => (
                    <div key={index}>
                      <div className="font-bold">
                        {groupedOrderIngredient.product.name}
                      </div>
                      {groupedOrderIngredient.ingredients.map(
                        (ingredient, ingredientIndex) => (
                          <div key={ingredientIndex}>
                            {ingredient.name} ={' '}
                            {order.OrderIngredient.find(
                              (item) => item.ingredient.id === ingredient.id,
                            )?.quantity || 0}
                          </div>
                        ),
                      )}
                    </div>
                  ),
                )}
              </div>

              <div>
                <Label className="text-black">Criado em</Label>
                <Input
                  className="text-black disabled:opacity-100"
                  value={date ? format(date, 'dd/MM/yyyy  h:mm') : ''}
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
  )
}
