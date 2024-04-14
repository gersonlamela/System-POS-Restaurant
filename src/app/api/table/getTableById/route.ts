import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    const tableId = searchParams.get('id')

    if (!tableId) {
      return NextResponse.json(
        {
          message: 'Não existe Id da mesa',
        },
        { status: 404 },
      )
    }
    // Fetch products by categoryId
    const table = await prisma.table.findFirst({
      where: {
        id: tableId,
      },
    })

    return NextResponse.json({
      table,
      message: 'Mesa encontrada com sucesso',
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        message: 'Algo deu errado ao buscar os produtos',
        error: error.message,
      },
      { status: 500 },
    )
  }
}
