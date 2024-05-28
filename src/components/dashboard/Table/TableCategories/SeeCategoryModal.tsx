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
import { ProductCategory } from '@prisma/client'

import { parseISO, format } from 'date-fns'
import { getCategoryIcon } from '@/functions/Category/category'

interface SeeCategoryModalProps {
  Category: ProductCategory
}

export default function SeeCategoryModal({ Category }: SeeCategoryModalProps) {
  if (!Category.createdAt) return

  const date = parseISO(Category?.createdAt.toString())

  console.log(format(date, 'dd/MM/yyyy  h:mm a'))
  return (
    <>
      <Dialog>
        <DialogTrigger className="flex h-[40px] w-[40px] items-center justify-center rounded-[5px]  border border-third bg-white text-third shadow-button5">
          <Binoculars size={20} />
        </DialogTrigger>
        <DialogContent className="w-auto bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Ver Categoria
            </DialogTitle>
            <hr />
            <DialogDescription className=" w-full ">
              <div className="mt-2 grid w-full grid-cols-2 items-start gap-6">
                <div className="flex h-full items-center justify-center">
                  {getCategoryIcon(Category.name, 70)}
                </div>
                <div className="mb-5">
                  <div>
                    <Label className="text-black">Id</Label>
                    <Input
                      className=" text-black  disabled:opacity-100"
                      value={Category.id}
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-black">Nome</Label>
                    <Input
                      className=" text-black  disabled:opacity-100"
                      value={Category.name}
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
                  <span>Editar Categoria</span>
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
