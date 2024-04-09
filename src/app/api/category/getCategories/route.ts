// pages/api/createUser.ts
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany()

    return NextResponse.json(
      {
        categories,
        message: 'Categorias encontradas com sucesso',
      },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Algo de errado aconteceu' },
      { status: 500 },
    )
  }
}
