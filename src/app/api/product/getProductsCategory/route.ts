import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const CategoryProducts = await prisma.productCategory.findMany()

    return NextResponse.json(
      {
        CategoryProducts,
        message: 'Categoria de produtos encontrados com sucesso',
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
