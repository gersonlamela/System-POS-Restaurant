import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    const productId = searchParams.get('id')

    // Fetch products by categoryId
    const products = await prisma.product.findMany({
      where: {
        productCategoryId: productId,
      },
    })

    // Check if any products were found
    if (products.length === 0) {
      const allProducts = await prisma.product.findMany()
      return NextResponse.json({
        products: allProducts, // Sending all products if no category is specified
        message: 'Não foram encontrados produtos para esta categoria',
      })
    }

    return NextResponse.json({
      products,
      message: 'Produtos encontrados com sucesso',
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
