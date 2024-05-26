import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    const productId = searchParams.get('id')

    // Fetch products by categoryId
    if (!productId) {
      throw new Error('Product ID is required')
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    if (!product?.productCategoryId) {
      return NextResponse.json(
        {
          message: 'Não existe produto com este ID',
        },
        { status: 404 },
      )
    }

    const category = await prisma.productCategory.findUnique({
      where: {
        id: product?.productCategoryId,
      },
    })

    return NextResponse.json({
      category,
      message: 'Categoria encontrada com sucesso',
    })
  } catch (error: any) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      {
        message: 'Algo deu errado ao buscar os categorias',
        error: error.message,
      },
      { status: 500 },
    )
  }
}
