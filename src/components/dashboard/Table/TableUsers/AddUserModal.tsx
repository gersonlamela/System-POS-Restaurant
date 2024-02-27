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

const FormSchema = z
  .object({
    name: z.string().min(1, 'Nome de utilizador é obrigatório').max(100),
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
    address: z.string().min(1, 'Address is required'),
    phone: z.string().min(9, 'Phone de utilizador é obrigatório').max(9),
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
        location.href = '/'
      }

      toast.error(data.message)
    } catch (error) {
      console.log('There was an error', error)
    }
  }
  return (
    <>
      <Dialog>
        <DialogTrigger className="flex flex-row items-center gap-2 rounded-lg bg-black px-2 py-2 text-white">
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
                          <FormLabel className="text-black">Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="mail@example.com" {...field} />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="address"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Morada</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Aliados nº211 1ºdireito"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            Telemóvel
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="912345678"
                              type="tel"
                              maxLength={9}
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Pin</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="****"
                              maxLength={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            Confirmar o pin
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="****"
                              type="tel"
                              maxLength={4}
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
                          <FormLabel className="text-black">Função</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded border p-2"
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
                  </div>
                  <div className="flex w-full justify-end gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      variant={'outline'}
                    >
                      {form.formState.isSubmitting ? (
                        <span className="spinner-border spinner-border-sm mr-1"></span>
                      ) : (
                        <span>Criar utilizador</span>
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
