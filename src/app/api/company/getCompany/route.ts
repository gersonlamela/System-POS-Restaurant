// pages/api/createUser.ts
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const company = await prisma.company.findFirst()

    return NextResponse.json(
      {
        company,
        message: 'Empresa encontrada com sucesso',
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { message: 'Algo de errado aconteceu' },
      { status: 500 },
    )
  }
}
