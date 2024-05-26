import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        Table: true,
        User: true,
        OrderProduct: {
          include: {
            OrderIngredient: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      { orders, message: 'Orders encontrados com sucesso' },
      { status: 201 },
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { message: 'Algo de errado aconteceu' },
      { status: 500 },
    )
  }
}
