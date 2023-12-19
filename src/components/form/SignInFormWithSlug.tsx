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
import { Button } from '../ui/button';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

import { useToast } from '../ui/use-toast';

import { UserSignIn } from './UserSignIn';


const FormSchema = z.object({
  userId: z.string().min(1, 'O ID do utilizador é obrigatório'),
  pin: z
    .string()
    .refine((data) => /^\d{4}$/.test(data), {
      message: 'O PIN deve ser um número com 4 dígitos',
    }),
});

const SignInForm = ({ params }: { params: { slug: string } }) => {

 const {toast} = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: params.slug,
      pin: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
   const signInData = await signIn('credentials', {
    id: values.userId,
    pin: values.pin,
    redirect: false,
   })
   if(signInData?.error) {
    toast({
      title: 'Erro',
      description: signInData.error,
      variant: 'destructive'
    })
   }else{
    location.href = '/dashboard/admin'
   }
  };

  

  return (
    <div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='space-y-2'>
        <FormField
            control={form.control}
            name='userId' // Alterar o nome do campo para userId
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Utilizador</FormLabel>
                <FormControl>
                  <Input placeholder='Insira o seu ID de utilizador' {...field}  value={params.slug} disabled/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
            control={form.control}
            name='pin'
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Insira o seu PIN'
                    max={9999}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full mt-6' type='submit'>
          Sign in
        </Button>
      </form>

      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
            <Button
              key={number}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => form.setValue('pin', form.getValues('pin') + String(number))}
            >
              {number}
            </Button>
          ))}
        </div>
        {/* Botão para Limpar */}
        <Button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => form.setValue('pin', '')}
        >
          Limpar
        </Button>
            </div>
      <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
        or
      </div>
    
      <p className='text-center text-sm text-gray-600 mt-2'>
      Se ainda não tem uma conta, por favor&nbsp;
      <Link className='text-blue-500 hover:underline' href='/sign-up'>
          Registe-se
        </Link>
      </p>
    </Form>



    </div>
  );
};

export default SignInForm;