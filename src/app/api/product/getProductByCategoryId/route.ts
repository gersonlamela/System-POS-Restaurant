import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    const categoryId = searchParams.get('id')

    // Fetch products by categoryId
    const products = await prisma.product.findMany({
      where: {
        productCategoryId: categoryId,
      },
      include: {
        ProductIngredient: {
          include: {
            ingredient: true,
          },
        },
        ProductCategory: true,
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
  } catch (error: unknown) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        message: 'Algo deu errado ao buscar os produtos',
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
