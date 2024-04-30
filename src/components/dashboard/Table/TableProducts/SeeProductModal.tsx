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

import { parseISO, format } from 'date-fns'
import { getTax } from '@/functions/Product/product'
import IngredientsList from '@/components/IngredientsList'
import { ProductWithIngredients } from '@/types/Product'

interface SeeProductModalProps {
  Product: ProductWithIngredients
}

export default function SeeProductModal({ Product }: SeeProductModalProps) {
  if (!Product) return null

  const date = parseISO(Product.createdAt.toString())

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
              Ver Product
            </DialogTitle>
            <hr />
            <DialogDescription className=" w-full ">
              <div className="mt-2 grid w-full grid-cols-2 items-start gap-6">
                <div className="flex h-full items-center justify-center">
                  <img
                    src={`/uploads/products/${Product.image}`}
                    alt={Product.name}
                    width={200}
                    height={200}
                    className="h-[200px] w-[200px] object-contain"
                  />
                </div>
                <div className="mb-5">
                  <div>
                    <Label className="text-black">Id</Label>
                    <Input
                      className=" text-black  disabled:opacity-100"
                      value={Product.id}
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-black">Nome</Label>
                    <Input
                      className=" text-black  disabled:opacity-100"
                      value={Product.name}
                      disabled
                    />
                  </div>

                  <div>
                    <Label className="text-black">Preço</Label>

                    <Input
                      className=" text-black  disabled:opacity-100"
                      value={Product.price}
                      disabled
                    />
                  </div>

                  <div>
                    <Label className="text-black">Categoria</Label>

                    <Input
                      className=" text-black  disabled:opacity-100"
                      value={Product.name}
                      disabled
                    />
                  </div>

                  <div>
                    <Label className="text-black">Imposto</Label>

                    <Input
                      className=" text-black  disabled:opacity-100"
                      value={getTax(Product.tax)}
                      disabled
                    />
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
              </div>
              <IngredientsList product={Product} />

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
                  <span>Editar Produto</span>
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
