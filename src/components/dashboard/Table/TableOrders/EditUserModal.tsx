import React, { useState } from 'react'
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
import { CircleNotch, Pencil, Spinner, SpinnerGap } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { User } from '@prisma/client'

const FormSchema = z.object({
  name: z.string().min(1, 'Nome de utilizador é obrigatório').max(100),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  address: z.string().min(1, 'Morada é obrigatória'),
  phone: z
    .string()
    .min(9, 'Nº telemóvel do utilizador é obrigatório')
    .max(9, 'Número de telefone inválido'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).refine((data) => data, {
    message: 'Selecione o status',
  }),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).refine((data) => data, {
    message: 'Selecione uma função',
  }),
})

interface EditUserModalProps {
  user: User
}

export default function EditUserModal({ user }: EditUserModalProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user.email,
      address: user.address,
      name: user.name,
      phone: user.phone,
      status: user.status,
      role: user.role,
    },
  })

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log(values)
    try {
      const response = await fetch(`/api/user/editUser?id=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        location.href = '/dashboard/users'
        toast.success('Utilizador editado com sucesso!')
      } else {
        const data = await response.json()
        console.error('Erro ao atualizar utilizador:', data.message)
        toast.error('Erro ao atualizar utilizador.')
      }
    } catch (error: any) {
      console.error('Aconteceu algum erro', error.message)
      toast.error('Erro ao atualizar utilizador.')
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger
          className="flex flex-row items-center gap-2 rounded-lg bg-black px-2 py-2 text-white"
          onClick={() => {
            form.reset()
          }}
        >
          <Pencil size={16} weight="bold" />
        </DialogTrigger>
        <DialogContent className="min-w-[630px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Edit User
            </DialogTitle>
            <hr />
            <DialogDescription className=" w-full ">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  <div className="mt-2 grid w-full  items-start gap-6 md:grid-cols-2">
                    {/* Form fields */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Função
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded border bg-zinc-50 p-2 text-black"
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="MANAGER">Gestor</option>
                              <option value="EMPLOYEE">Funcionário</option>
                            </select>
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Status
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded border bg-zinc-50 p-2 text-black"
                            >
                              <option value="ACTIVE">Ativo</option>
                              <option value="INACTIVE">Inativo</option>
                              <option value="SUSPENDED">Suspenso</option>
                            </select>
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex w-full justify-end gap-2">
                    <DialogClose asChild>
                      <Button
                        onClick={() => {
                          form.reset()
                        }}
                        type="button"
                        variant="secondary"
                        className="mt-4 text-white hover:bg-red-500"
                      >
                        Close
                      </Button>
                    </DialogClose>
                    {/* Movido o botão "Editar utilizador" para dentro do formulário */}
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      variant={'outline'}
                      className="mt-4 hover:bg-green-500 hover:text-white"
                    >
                      {form.formState.isSubmitting ? (
                        <CircleNotch size={16} className="animate-spin" />
                      ) : (
                        'Editar utilizador'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
