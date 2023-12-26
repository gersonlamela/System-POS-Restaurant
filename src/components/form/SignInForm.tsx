'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';


import { toast } from 'sonner';
import { Button } from '../ui/button';
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';
import user from '../user';
import { useState } from 'react';







const FormSchema = z.object({
  userId: z.string().min(1, 'O ID do utilizador é obrigatório'),
  pin: z
    .string()
    .refine((data) => /^\d{4}$/.test(data), {
      message: 'O PIN deve ser um número com 4 dígitos',
    }),
});


const SignInForm = ({ params,user }: { params: { id: string},user:User}) => {
  const router = useRouter()
  const [pin, setPin] = useState(['', '', '', '']);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: params.id,
      pin: '',
    },
  });

  const handleNumberPad = (number: string) => {
    const currentPin = form.getValues('pin');
    if (pin.length && currentPin.length < 4) {
      form.setValue('pin', form.getValues('pin') + number);
    }

    const newPin = [...pin];
    const emptyIndex = newPin.indexOf('');

    if (emptyIndex !== -1) {
      newPin[emptyIndex] = number;
      setPin(newPin);
    }

  };

  const handleClearNumberPad = () => {
    form.setValue('pin', '')
    setPin(['', '', '', '']);
  };

const handleBackspace = () => {
  const newPin = [...pin];

  for (let i = newPin.length - 1; i >= 0; i--) {
    if (newPin[i] !== '') {
      newPin[i] = '';
      setPin(newPin);
      form.setValue('pin', newPin.join(''));
      break;
    }
  }
};

  
  



  async function onSubmit(values: z.infer<typeof FormSchema>) {
   const signInData =  await signIn('credentials', {
    id: values.userId,
    pin: values.pin,
    redirect: false,
   }) 

   if (signInData?.error) {
    toast.error(signInData.error)
    return
  }

 location.href = '/pos'
  };

  

  return (
    <div className='max-w-[450px]'>
      {user.username && <h1 className='text-2xl'>{user.username}</h1>}
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='space-y-2'>
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
            name='pin'
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN</FormLabel>
                <FormControl>
                <div className="flex space-x-3" data-hs-pin-input>
                {pin.map((digit, index) => (
                        <input
                        key={index}
                        type="text"
                        className="block w-[40px] h-[40px] text-center border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-default bg-white dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                        placeholder="⚬"
                        disabled
                        data-hs-pin-input-item
                       value={digit}
                        />
                      ))}
   </div>
                 
                </FormControl>
      
                <FormMessage className='text-red-500 absolute' />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full mt-6 bg-gray-600 text-white' type='submit' > 
          Sign in
        </Button>
      </form>

      <div className="mt-4 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
              <Button
                key={number}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleNumberPad(number.toString())}
              >
                {number}
              </Button>
            ))}
          </div>
          {/* Botão para Limpar */}
          <Button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleClearNumberPad}
          >
            Limpar
          </Button>
          <Button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleBackspace}
            >
              Backspace
            </Button>
            </div>
    </Form>



    </div>
  );
};


export async function getServerSideProps() {
  // Aqui você pode implementar a lógica para obter os dados do usuário.
  // Estou usando um objeto de exemplo para simular o nome do usuário.
  const user = { name: 'Usuário de Exemplo' };

  return {
    props: {
      user,
    },
  };
}




export default SignInForm;



