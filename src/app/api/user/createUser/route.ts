// pages/api/createUser.ts
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

import * as z from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { genSaltSync, hashSync } from 'bcrypt-ts'

const authenticateAndAuthorize = async (req: any): Promise<boolean> => {
  try {
    const session = await getServerSession(authOptions)

    console.log(session)

    if (!session) {
      console.error('No session found.')
      return false
    }

    // Check if the user has the 'ADMIN' role
    if (session.user?.role !== 'ADMIN') {
      console.error('User is not an admin.')
      return false
    }

    return true
  } catch (error) {
    console.error('Authentication error:', error)
    return false
  }
}

const userSchema = z.object({
  name: z.string().min(1, 'Nome de utilizador é necessário').max(100),
  email: z.string().min(1, 'Email é necessário').email('Email é inválido'),
  address: z.string().min(1, 'Address de utilizador é necessário'),
  phone: z
    .string()
    .regex(/^9[1236]\d{7}$/, 'Phone number must be a valid Portugal number'),
  pin: z
    .string()
    .min(1, 'Pin is required')
    .min(4, 'Pin must have than 4 characters'),
  role: z
    .enum(['ADMIN', 'MANAGER', 'EMPLOYEE'])
    .refine((data) => ['ADMIN', 'MANAGER', 'EMPLOYEE'].includes(data), {
      message: 'Role inválida',
    }),
})

export async function POST(req: Request, res: Response) {
  try {
    const isAuthenticatedAndAuthorized = await authenticateAndAuthorize(req)

    if (!isAuthenticatedAndAuthorized) {
      return NextResponse.json(
        {
          user: null,
          message: 'Unauthorized. User must be logged in as an admin.',
        },
        { status: 401 },
      )
    }
    const body = await req.json()

    const { name, email, pin, role, address, phone } = userSchema.parse(body)

    // Verifica se o e-mail existe
    const existingEmailUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingEmailUser) {
      return NextResponse.json(
        { user: null, message: 'O email do utilizador já existe' },
        { status: 409 },
      )
    }

    // Verifica se o nome existe
    const existingname = await prisma.user.findUnique({
      where: {
        name,
      },
    })

    if (existingname) {
      return NextResponse.json(
        { user: null, message: 'O nome do utilizador já existe' },
        { status: 409 },
      )
    }

    const salt = genSaltSync(10)
    const hashedPin = hashSync(pin, salt)

    // Insere os dados na base de dados usando o Prisma
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        pin: hashedPin,
        role,
        address,
        phone,
      },
    })

    const { pin: newUserPin, ...rest } = newUser

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { user: rest, message: 'Utilizador criado com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Algo de errado aconteceu' },
      { status: 500 },
    )
  }
}
