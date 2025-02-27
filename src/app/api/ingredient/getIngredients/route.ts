// pages/api/createUser.ts
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const ingredient = await prisma.ingredient.findMany()

    return NextResponse.json(
      {
        ingredients: ingredient,
        message: 'Ingredientes encontrados com sucesso',
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
