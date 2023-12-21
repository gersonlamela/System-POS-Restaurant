// pages/api/createUser.ts
import {NextResponse} from 'next/server';

import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';

import * as z from 'zod';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const authenticateAndAuthorize = async (req: any): Promise<boolean> => {
  try {
    const session = await getServerSession(authOptions);

    console.log(session)

    if (!session) {
      console.error('No session found.');
      return false;
    }

    // Check if the user has the 'ADMIN' role
    if (session.user?.role !== 'ADMIN') {
      console.error('User is not an admin.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

const userSchema = z
  .object({
    username: z.string().min(1, 'Nome de utilizador é necessário').max(100),
    email: z.string().min(1, 'Email é necessário').email('Email é inválido'),
    pin: z
      .string()
      .min(1, 'Pin is required')
      .min(4, 'Pin must have than 4 characters'),
    role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE'])
      .refine((data) => ['ADMIN', 'MANAGER', 'EMPLOYEE'].includes(data), {
        message: 'Role inválida'
      })
  })


export async function POST(req:Request,res:Response) {
  try {
   const isAuthenticatedAndAuthorized = await authenticateAndAuthorize(req);

    if (!isAuthenticatedAndAuthorized) {
      return NextResponse.json(
        { user: null, message: 'Unauthorized. User must be logged in as an admin.' },
        { status: 401 }
      );
    } 
    const body = await req.json();

    const { username, email, pin, role } = userSchema.parse(body);

    // Verifica se o e-mail existe
    const existingEmailUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingEmailUser) {
    return  NextResponse.json({ user:null, message: 'O email do utilizador já existe' }, { status: 409 });
    }

    // Verifica se o nome existe
    const existingUserName = await prisma.user.findUnique({
      where: {
        username
      },
    });

    if (existingUserName) {
      return  NextResponse.json({ user:null, message: 'O nome do utilizador já existe' }, { status: 409 });
    }

    const hashedPin = await hash(pin,10);

    // Insere os dados na base de dados usando o Prisma
    const newUser = await prisma.user.create({
      data: {
        username,
        email: email,
        pin: hashedPin,
        role,
      },
    });

    const {pin: newUserPin ,...rest} = newUser;

    // Retorna uma resposta de sucesso
    return NextResponse.json({ user:rest, message: 'Utilizador criado com sucesso' },{ status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Algo de errado aconteceu' }, { status: 500 });
  }
}
