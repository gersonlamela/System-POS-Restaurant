import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tables = await prisma.table.findMany()

    return NextResponse.json(
      { table: tables, message: 'Mesas encontradas com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Algo de errado aconteceu' },
      { status: 500 },
    )
  }
}
