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
import { Plus } from '@phosphor-icons/react'
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const FormSchema = z
  .object({
    name: z.string().min(1, 'Nome de utilizador é obrigatório').max(100),
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
    address: z.string().min(1, 'Morada é obrigatória'),
    phone: z.string().min(9, 'Nº telemóvel do utilizador é obrigatório').max(9),
    pin: z.string().refine((data) => /^\d{1,4}$/.test(data), {
      message: 'O pin deve ser um número com no máximo 4 dígitos',
    }),
    confirmPin: z.string().refine((data) => /^\d{1,4}$/.test(data), {
      message:
        'A confirmação do pin deve ser um número com no máximo 4 dígitos',
    }),
    role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).refine((data) => data, {
      message: 'Selecione uma função',
    }),
  })

  .refine((data) => data.pin === data.confirmPin, {
    path: ['confirmPin'],
    message: 'Pin não coincide com a confirmação do pin',
  })

export default function AddUserModal() {
  const { handleSubmit, formState } = useForm()
  const { isSubmitting } = formState

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      pin: '',
      address: '',
      phone: '',
      confirmPin: '',
      role: 'ADMIN',
    },
  })

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    values.pin = String(values.pin)
    values.confirmPin = String(values.confirmPin)

    try {
      const response = await fetch('/api/user/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          pin: values.pin,
          role: values.role,
          address: values.address,
          phone: values.phone.toString(),
        }),
      })

      const data = await response.json()
      if (response.ok) {
        location.href = '/dashboard/users'
      }

      toast.error(data.message)
    } catch (error) {
      console.log('There was an error', error)
    }
  }
  const { reset } = form
  return (
    <>
      <Dialog>
        <DialogTrigger
          className="flex flex-row items-center gap-2 rounded-lg bg-black px-2 py-2 text-white"
          onClick={() => {
            reset()
          }}
        >
          <Plus size={16} weight="bold" />
          Adicionar utilizador
        </DialogTrigger>
        <DialogContent className="min-w-[630px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Adicionar Utilizador
            </DialogTitle>
            <hr />
            <DialogDescription className=" w-full ">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  <div className="mt-2 grid w-full grid-cols-2 items-start gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Nome
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              placeholder="johndoe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500" />
                        </FormItem>
                      )}
                    />
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
                              placeholder="mail@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="address"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Morada
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              placeholder="Aliados nº211 1ºdireito"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Telemóvel
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              {...field}
                              placeholder="912345678"
                              type="tel"
                              maxLength={9}
                            />
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Pin
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              type="tel"
                              placeholder="****"
                              maxLength={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className=" mt-2 w-1/2 text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Confirmar o pin
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              placeholder="****"
                              type="tel"
                              maxLength={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500" />
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
                            <Select>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={field.value} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="MANAGER">Gestor</SelectItem>
                                <SelectItem value="EMPLOYEE">
                                  Funcionário
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {/*   <select
                              {...field}
                              className="w-full rounded border bg-zinc-50 p-2 text-black"
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="MANAGER">Gestor</option>
                              <option value="EMPLOYEE">Funcionário</option>
                            </select> */}
                          </FormControl>
                          <FormMessage className="mt-2 text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex w-full justify-end gap-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-white hover:bg-red-500 "
                      >
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      variant={'outline'}
                      className="hover:bg-green-500 hover:text-white"
                    >
                      {form.formState.isSubmitting ? (
                        <span className="spinner-border spinner-border-sm mr-1"></span>
                      ) : (
                        <span className="  ">Criar Utilizador</span>
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
