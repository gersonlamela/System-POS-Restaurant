// pages/api/createUser.ts
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        address: true,
        name: true,
        phone: true,
        role: true,
        status: true,
      },
    })

    return NextResponse.json(
      { user: users, message: 'Utilizador encontrados com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Algo de errado aconteceu' },
      { status: 500 },
    )
  }
}
