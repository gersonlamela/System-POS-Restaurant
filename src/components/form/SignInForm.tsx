'use client'

import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { SignIn, XCircle } from '@phosphor-icons/react'

import { toast } from 'sonner'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'

import { User } from '@prisma/client'

const FormSchema = z.object({
  userId: z.string().min(1, 'O ID do utilizador é obrigatório'),
  pin: z.string().refine((data) => /^\d{4}$/.test(data), {
    message: 'O PIN deve ser um número com 4 dígitos',
  }),
})

interface SignInFormProps {
  user: User
  handleCloseModal: () => void
}

const SignInForm = ({ user, handleCloseModal }: SignInFormProps) => {
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

  const { dirtyFields } = form.formState

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      id: values.userId,
      pin: values.pin,
      redirect: false,
    })

    if (signInData?.error) {
      toast.error(signInData.error)
    } else {
      // Redirecionar para a página desejada após o login bem-sucedido
      location.href = '/' // Substitua '/dashboard' pelo caminho desejado
    }
  }

  return (
    <div
      className="absolute inset-0 z-50 flex w-full flex-col items-center justify-center bg-[#FEF0E780]"
      onClick={handleOutsideClick}
    >
      <div className="flex h-[670px] w-[450px] flex-col items-center justify-between rounded-[30px] bg-white px-[50px] py-[30px]">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const pinFieldValue = form.getValues('pin') as string

              if (pinFieldValue.length === 4) {
                onSubmit(form.getValues())
              }
            }}
            className="flex flex-col gap-[20px]"
          >
            {user.name && (
              <h1 className="text-center text-3xl font-semibold">
                {user.name}
              </h1>
            )}
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex space-x-3" data-hs-pin-input>
                        {[0, 1, 2, 3].map((index) => (
                          <input
                            key={index}
                            type="text"
                            className="flex h-[85px] w-[85px] items-center justify-center rounded-md border-gray-200 bg-white text-center text-3xl font-semibold shadow-lg"
                            disabled
                            data-hs-pin-input-item
                            value={field.value[index] || ''} // Use o valor do campo se disponível, caso contrário, use uma string vazia
                          />
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <Button
                  key={number}
                  className="flex h-[100px] w-[100px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-black shadow-md"
                  onClick={() =>
                    form.setValue('pin', form.getValues('pin') + number)
                  }
                >
                  {number}
                </Button>
              ))}
              <Button
                className="flex h-[100px] w-[100px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-primary shadow-md"
                onClick={() => form.setValue('pin', '')}
              >
                <XCircle size={36} />
              </Button>
              <Button
                className="flex h-[100px] w-[100px] items-center justify-center rounded-[10px] bg-white text-3xl font-semibold text-black shadow-md"
                onClick={() =>
                  form.setValue('pin', form.getValues('pin') + '0')
                }
              >
                0
              </Button>
              <Button
                onClick={() =>
                  form.setValue('pin', form.getValues('pin').slice(0, -1))
                }
                className="flex h-[100px] w-[100px] items-center justify-center rounded-[10px] bg-primary text-3xl font-semibold text-white shadow-md"
              >
                <SignIn size={36} />
              </Button>
            </div>
          </form>
        </Form>
      </div>
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
