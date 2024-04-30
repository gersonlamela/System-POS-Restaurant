import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    const productId = searchParams.get('id')

    if (!productId) {
      throw new Error('Product ID is required')
    }

    // Fetch products by categoryId
    const ingredients = await prisma.productIngredient.findMany({
      where: {
        productId,
      },
      include: {
        ingredient: true,
      },
    })

    // Check if any products were found
    if (ingredients.length === 0) {
      const allProducts = await prisma.product.findMany()
      return NextResponse.json({
        products: allProducts, // Sending all products if no category is specified
        message: 'Não foram encontrados ingredientes para este produto',
      })
    }

    return NextResponse.json({
      ingredients,
      message: 'Ingredientes encontrados com sucesso',
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
