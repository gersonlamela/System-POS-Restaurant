import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, 'Nome de utilizador é necessário').max(100),
  email: z.string().min(1, 'Email é necessário').email('Email é inválido'),
  address: z.string().min(1, 'Address de utilizador é necessário'),
  phone: z
    .string()
    .regex(/^9[1236]\d{7}$/, 'Phone number must be a valid Portugal number'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).refine((data) => data, {
    message: 'Selecione o status',
  }),
  role: z
    .enum(['ADMIN', 'MANAGER', 'EMPLOYEE'])
    .refine((data) => ['ADMIN', 'MANAGER', 'EMPLOYEE'].includes(data), {
      message: 'Role inválida',
    }),
})

export async function PUT(request: NextRequest) {
  const body = await request.json()

  const { name, email, status, role, address, phone } = userSchema.parse(body)
  const { searchParams } = new URL(request.url)

  try {
    const id = searchParams.get('id') as string

    const existingUser = await prisma.user.findUnique({ where: { id } })

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 },
      )
    }

    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        role,
        status,
      },
    })

    return NextResponse.json(
      { message: 'Usuário atualizado com sucesso' },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      {
        message: 'Algo deu errado ao atualizar o usuário',
        error: error.message,
      },
      { status: 500 },
    )
  }
}
