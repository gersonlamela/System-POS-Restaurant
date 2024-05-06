'use client'

import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Backspace, XCircle } from '@phosphor-icons/react'

import { toast } from 'sonner'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'

import { User } from '@prisma/client'
import { useState } from 'react'

const FormSchema = z.object({
  userId: z.string().min(1, 'O ID do utilizador é obrigatório'),
  pin: z.string().refine((data) => /^\d{4}$/.test(data), {
    message: 'O PIN deve ser um número com 4 dígitos',
  }),
})

interface SignInFormProps {
  user: User
  handleCloseModal: () => void
  handleClearSelectedUser: () => void
}

const SignInForm = ({
  user,
  handleCloseModal,
  handleClearSelectedUser,
}: SignInFormProps) => {
  const [pinError, setPinError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: user.id,
      pin: '',
    },
  })

  const handleOutsideClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (event.target === event.currentTarget) {
      handleCloseModal()
    }
  }

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (values.pin.length !== 4) {
      setPinError('O PIN deve ter exatamente 4 dígitos.')
      return
    }

    const signInData = await signIn('credentials', {
      id: values.userId,
      pin: values.pin,
      redirect: false,
    })

    if (signInData?.error) {
      toast.error(signInData.error)
      setPinError('Pin Ivalido')
    } else {
      location.href = '/'
    }
  }

  return (
    <div
      className={`absolute inset-0 z-50 flex w-full flex-col items-center justify-center`}
      onClick={handleOutsideClick}
    >
      <div
        className={`flex h-[650px] w-[400px] flex-col items-center justify-between rounded-[30px] bg-white px-[50px] py-[20px] shadow-button20 `}
      >
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const pinFieldValue = form.getValues('pin') as string

              if (pinFieldValue.length === 4) {
                onSubmit(form.getValues())
              }
            }}
            className="flex h-full w-[300px] flex-col items-center gap-[20px]"
          >
            {user.name && (
              <h1 className="text-center text-[26px] font-semibold uppercase text-third">
                {user.name}
              </h1>
            )}

            <div className="flex w-full flex-col">
              <FormField
                control={form.control}
                name="pin"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div
                        className={`flex h-[65px] w-full items-end justify-center rounded-[10px] bg-white text-center text-3xl font-semibold text-primary shadow-button10 ${pinError ? 'border border-primary' : ''}`}
                      >
                        <div
                          className={`flex h-full items-center justify-center`}
                        >
                          {form
                            .getValues('pin')
                            .split('')
                            .map(() => '*')
                            .join('')}
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid w-full grid-cols-3 gap-[15px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <Button
                  key={number}
                  className="flex h-[90px] w-[90px] items-center justify-center rounded-[10px] bg-white text-[30px] font-semibold text-third shadow-button10"
                  onClick={() => {
                    const pinLength = form.getValues('pin').length
                    if (pinLength < 4) {
                      form.setValue('pin', form.getValues('pin') + number)
                    }
                  }}
                >
                  {number}
                </Button>
              ))}
              <Button
                className="flex h-[90px] w-[90px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-primary shadow-button10"
                onClick={() => handleClearSelectedUser()}
              >
                <XCircle size={36} />
              </Button>
              <a
                href="/"
                className="flex h-[90px] w-[90px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-third shadow-button10"
              >
                0
              </a>
              <Button
                onClick={() =>
                  form.setValue('pin', form.getValues('pin').slice(0, -1))
                }
                className="flex h-[90px] w-[90px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-primary shadow-button10"
              >
                <Backspace size={36} />
              </Button>
            </div>

            <div className="flex w-full items-center justify-center text-[24px] font-bold text-third">
              POSLamela
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignInForm
