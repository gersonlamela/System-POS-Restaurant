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
import { User } from '@prisma/client'
import { getRole } from '@/functions/user/user'
import { parseISO, format } from 'date-fns'

interface SeeUserModalProps {
  user: User
}

export default function SeeUserModal({ user }: SeeUserModalProps) {
  if (!user) return null

  const date = parseISO(user.createdAt.toString())

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
                    value={user.id}
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-black">Nome</Label>
                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={user.name}
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-black">Email</Label>

                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={user.email}
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-black">Morada</Label>

                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={user.address}
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-black">Telemóvel</Label>

                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={user.phone}
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-black">Função</Label>

                  <Input
                    className=" text-black  disabled:opacity-100"
                    value={getRole(user.role)}
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
              <div className="flex w-full justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
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
