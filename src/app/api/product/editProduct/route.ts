import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProductCategory, ProductIngredient, Tax } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import cuid from 'cuid'

export async function PUT(request: NextRequest) {
  const data = await request.formData()
  const { searchParams } = new URL(request.url)

  try {
    const id = searchParams.get('id') as string
    const name = data.get('name') as string
    const price = parseFloat(data.get('price') as string)
    const tax = data.get('tax') as Tax
    const discount = parseInt(data.get('discount') as string) || undefined
    const stock = parseInt(data.get('stock') as string) || undefined
    const category = data.get('category') as ProductCategory['id']
    const categoryData = await prisma.productCategory.findUnique({
      where: { id: category },
      select: { name: true },
    })
    const ingredients = JSON.parse(
      data.get('ingredients') as string,
    ) as ProductIngredient[]

    console.log(ingredients)

    const categoryName = categoryData
      ? categoryData.name.replace(/\s+/g, '')
      : 'UnknownCategory' // Remover espaços em branco

    // Verifica se a imagem foi modificada
    const file: File | null = data.get('file') as unknown as File
    let imageName: string | undefined
    if (file) {
      const cuidValue = cuid()
      const extension = file.name.split('.').pop() as string
      imageName = `${cuidValue}.${extension}`

      const imagePath = join(
        './public/uploads/products',
        categoryName,
        `${cuidValue}.${extension}`,
      )

      // Check if directory exists, if not, create it
      await mkdir(join('./public/uploads/products', categoryName), {
        recursive: true,
      })

      // Faz o upload da nova imagem
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(imagePath, buffer)
    }

    const existingCategory = await prisma.productCategory.findUnique({
      where: { id: category },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Categoria de produto não encontrada' },
        { status: 404 },
      )
    }
    const product = await prisma.product.findUnique({
      where: { id },
      include: { ProductIngredient: true },
    })
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    const connectedIngredients = product.ProductIngredient.filter((pi) =>
      ingredients.some((ingredient) => ingredient.id === pi.ingredientId),
    )

    const newIngredients = ingredients.filter(
      (ingredient) =>
        !connectedIngredients.some((pi) => pi.ingredientId === ingredient.id),
    )

    // Atualiza o produto no banco de dados
    await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        tax,
        discount,
        stock,
        ProductCategory: { connect: { id: category } },
        ProductIngredient: {
          connectOrCreate: newIngredients.map((ingredient) => ({
            where: {
              productId_ingredientId: {
                productId: id,
                ingredientId: ingredient.id,
              },
            },
            create: {
              ingredient: { connect: { id: ingredient.id } },
              quantity: ingredient.quantity,
            },
          })),
          updateMany: connectedIngredients.map((ingredient) => ({
            where: { id: ingredient.id },
            data: {
              quantity: ingredients.find(
                (i) => i.id === ingredient.ingredientId,
              )?.quantity,
            },
          })),
        },
        // Se a imagem foi modificada, atualiza o nome da imagem
        ...(imageName && { image: imageName }),
      },
    })

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
