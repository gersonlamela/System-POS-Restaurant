import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        Table: true,
        User: true,
      },
    })

    return NextResponse.json(
      { orders, message: 'Orders encontrados com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Algo de errado aconteceu' },
      { status: 500 },
    )
  }
}
