import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Tax, ProductCategory } from '@prisma/client'
import cuid from 'cuid'
import { writeFile } from 'fs/promises'

export async function PUT(request: NextRequest) {
  const data = await request.formData()
  const { searchParams } = new URL(request.url)
  const file: File | null = data.get('file') as unknown as File

  try {
    const id = searchParams.get('id') as string
    const name = data.get('name') as string
    const price = parseFloat(data.get('price') as string)
    const tax = data.get('tax') as Tax
    const discount = parseInt(data.get('discount') as string) || undefined
    const category = data.get('category') as ProductCategory
    const ingredients = JSON.parse(
      data.get('ingredients') as string,
    ) as string[]

    const existingProduct = await prisma.product.findUnique({ where: { id } })

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 },
      )
    }

    // Verifique se os ingredientes são IDs válidos e correspondem aos ingredientes existentes no banco de dados
    const validIngredients = await prisma.ingredient.findMany({
      where: {
        id: {
          in: ingredients,
        },
      },
    })

    // Se algum dos ingredientes fornecidos não for válido, retorne um erro
    if (validIngredients.length !== ingredients.length) {
      return NextResponse.json(
        { message: 'Um ou mais ingredientes fornecidos não são válidos' },
        { status: 400 },
      )
    }

    await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        tax,
        discount,
        category,
        ingredients: {
          set: ingredients.map((ingredientId) => ({ id: ingredientId })),
        },
      },
    })

    // Resto do código para atualizar a imagem do produto...

    return NextResponse.json(
      { message: 'Produto atualizado com sucesso' },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      {
        message: 'Algo deu errado ao atualizar o produto',
        error: error.message,
      },
      { status: 500 },
    )
  }
}
