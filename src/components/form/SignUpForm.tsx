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
import { useRouter } from 'next/navigation';


const FormSchema = z
  .object({
    username: z.string().min(1, 'Nome de utilizador é obrigatório').max(100),
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),  
    pin: z
      .string()
      .refine((data) => /^\d{1,4}$/.test(data), {
        message: 'O pin deve ser um número com no máximo 4 dígitos',
      }),
    confirmPin: z
      .string()
      .refine((data) => /^\d{1,4}$/.test(data), {
        message: 'A confirmação do pin deve ser um número com no máximo 4 dígitos',
      }),
    role: z.enum(['ADMIN', 'COZINHEIRO', 'FUNCIONARIO']).refine((data) => data, {
      message: 'Selecione uma função',
    }),
  })
  .refine((data) => data.pin === data.confirmPin, {
    path: ['confirmPin'],
    message: 'Pin não coincide com a confirmação do pin',
  });

const SignUpForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      pin: '',
      confirmPin: '',
      role: 'ADMIN', 
    },
  });
  const router = useRouter()
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    values.pin = String(values.pin);
    values.confirmPin = String(values.confirmPin);
   
    const response = await fetch('/api/auth/user',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        pin: values.pin,
        role:values.role
      })
    })

    if(response.ok){
      router.push('/sign-in')
    }else{
      console.error('Registration failed.')
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='johndoe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='mail@example.com' {...field} />
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
                <FormLabel>Pin</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Insere o teu pin'
                    max={9999} 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPin'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirma o teu pin</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Confirma o teu pin'
                    type='number'
                    max={9999}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <FormControl>
                  <select {...field} className='border rounded w-full p-2'>
                    <option value='ADMIN'>Admin</option>
                    <option value='COZINHEIRO'>Cozinheiro</option>
                    <option value='FUNCIONARIO'>Funcionário</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full mt-6' type='submit'>
          Sign up
        </Button>
      </form>
      <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
        or
      </div>
      <p className='text-center text-sm text-gray-600 mt-2'>
      Se ainda não tem uma conta, por favor&nbsp;
        <Link className='text-blue-500 hover:underline' href='/registar'>
          Registe-se
        </Link>
      </p>
    </Form>
  );
};

export default SignUpForm;