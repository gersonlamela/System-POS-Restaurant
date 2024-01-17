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

import { SignIn, XCircle } from '@phosphor-icons/react'

import { toast } from 'sonner'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'

import { User } from '@prisma/client'

import { useState } from 'react'
import Link from 'next/link'

const FormSchema = z.object({
  userId: z.string().min(1, 'O ID do utilizador é obrigatório'),
  pin: z.string().refine((data) => /^\d{4}$/.test(data), {
    message: 'O PIN deve ser um número com 4 dígitos',
  }),
})

const SignInForm = ({
  params,
  user,
}: {
  params: { id: string }
  user: User
}) => {
  const [pin, setPin] = useState(['', '', '', ''])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: params.id,
      pin: '',
    },
  })

  const handleNumberPad = (number: string) => {
    const currentPin = form.getValues('pin')
    if (pin.length && currentPin.length < 4) {
      form.setValue('pin', form.getValues('pin') + number)
    }

    const newPin = [...pin]
    const emptyIndex = newPin.indexOf('')

    if (emptyIndex !== -1) {
      newPin[emptyIndex] = number
      setPin(newPin)
    }
  }

  const handleClearNumberPad = () => {
    form.setValue('pin', '')
    setPin(['', '', '', ''])
  }

  const handleBackspace = () => {
    const newPin = [...pin]

    for (let i = newPin.length - 1; i >= 0; i--) {
      if (newPin[i] !== '') {
        newPin[i] = ''
        setPin(newPin)
        form.setValue('pin', newPin.join(''))
        break
      }
    }
  }

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const signInData = await signIn('credentials', {
      id: values.userId,
      pin: values.pin,
      redirect: false,
    })

    if (signInData?.error) {
      toast.error(signInData.error)
      return
    }

    location.href = '/'
  }

  return (
    <div className="flex h-[670px] w-[450px] flex-col items-center justify-between rounded-[30px] bg-white px-[50px] py-[30px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[20px]"
        >
          {user.name && (
            <h1 className="text-center text-3xl font-semibold">{user.name}</h1>
          )}
          <div className="flex flex-col ">
            {/*   <FormField
            control={form.control}
            name='userId' // Alterar o nome do campo para userId
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Utilizador</FormLabel>
                <FormControl>
                  <Input placeholder='Insira o seu ID de utilizador' {...field}  value={params.id} disabled/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex space-x-3" data-hs-pin-input>
                      {pin.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          className=" flex h-[85px] w-[85px] items-center justify-center rounded-md border-gray-200 bg-white text-center text-3xl font-semibold shadow-lg "
                          disabled
                          data-hs-pin-input-item
                          value={digit}
                        />
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/*    <Button className="mt-6 w-full bg-gray-600 text-white" type="submit">
            Sign in
          </Button> */}

          <div className="grid  grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                className="flex h-[100px] w-[100px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-black shadow-md "
                onClick={() => handleNumberPad(number.toString())}
              >
                {number}
              </Button>
            ))}
            <Button
              className="flex h-[100px] w-[100px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-primary shadow-md "
              onClick={handleClearNumberPad}
            >
              <XCircle size={36} />
            </Button>
            <Button
              className="flex h-[100px] w-[100px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-black shadow-md "
              onClick={() => handleNumberPad('0')}
            >
              0
            </Button>

            <Button
              onClick={handleBackspace}
              className="flex h-[100px] w-[100px] items-center justify-center rounded-[10px] bg-primary text-3xl font-semibold text-white shadow-md "
            >
              <SignIn size={36} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export async function getServerSideProps() {
  // Aqui você pode implementar a lógica para obter os dados do usuário.
  // Estou usando um objeto de exemplo para simular o nome do usuário.
  const user = { name: 'Usuário de Exemplo' }

  return {
    props: {
      user,
    },
  }
}

export default SignInForm
