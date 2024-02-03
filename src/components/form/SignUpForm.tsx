'use client'

import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Link from 'next/link'
import { toast } from 'sonner'

const FormSchema = z
  /**
   * Validation schema for sign up form using Zod.
   * - Validates required fields like name, email, pin etc.
   * - Checks formats of fields like email, phone, pin.
   * - Confirms pin and confirmPin match.
   * - Limits string lengths.
   * - Provides custom error messages for each validation.
   */

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

const SignUpForm = () => {
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
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
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" maxLength={9} />
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
                  <FormLabel>Pin</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Insere o teu pin"
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
                  <FormLabel>Confirma o teu pin</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirma o teu pin"
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
                  <FormLabel>Função</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full rounded border p-2">
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
          <Button className="mt-6 w-full" type="submit">
            Sign up
          </Button>
        </form>
        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
          or
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Se ainda não tem uma conta, por favor&nbsp;
          <Link className="text-blue-500 hover:underline" href="/registar">
            Registe-se
          </Link>
        </p>
      </Form>
    </div>
  )
}

export default SignUpForm
