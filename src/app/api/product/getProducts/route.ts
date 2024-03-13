// pages/api/createUser.ts
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany()

    return NextResponse.json(
      { product: products, message: 'Produtos encontrados com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Algo de errado aconteceu' },
      { status: 500 },
    )
  }
}
