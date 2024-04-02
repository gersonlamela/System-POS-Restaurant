import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    const id = searchParams.get('id') as string

    const existingUser = await prisma.user.findUnique({ where: { id } })

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { message: 'Utilizador encontrado com sucesso' },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Error in getUser route:', error)
    return NextResponse.json(
      { message: 'Algo de errado aconteceu' },
      { status: 500 },
    )
  }
}
