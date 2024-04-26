import { ProductCategory, ProductIngredient, Tax } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'
import cuid from 'cuid'
import { prisma } from '@/lib/prisma'

const ProductSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório.'),
  price: z.number().positive('O preço deve ser um valor positivo.'),
  image: z.string().optional(),
  tax: z.enum(['REDUCED', 'INTERMEDIATE', 'STANDARD']),
  discount: z.number().optional(),
  category: z.string(),
  ingredients: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  console.log(data)

  if (!file) {
    return NextResponse.json({ success: false })
  }

  try {
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
    const file = data.get('file') as File

    const cuidValue = cuid() // Generate cuid value

    const extension = file.name.split('.').pop() // Get file extension

    const imagePath = join(
      './public/uploads/products',
      `${cuidValue}.${extension}`,
    )

    // Check if directory exists, if not, create it
    await mkdir(join('./public/uploads/products'), {
      recursive: true,
    })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ImageName = `${cuidValue}.${extension}`

    await writeFile(imagePath, buffer)

    console.log('Stock ', stock)

    const createdProduct = await prisma.product.create({
      data: {
        name,
        ProductCategory: {
          connect: {
            id: category,
          },
        },
        price,
        image: ImageName,
        tax,
        discount,
        stock,
        ProductIngredient: {
          createMany: {
            data: ingredients.map((ingredient) => ({
              ingredientId: ingredient.id, // Assuming ingredient.id is the ID of the ingredient
              quantity: ingredient.quantity, // Assuming ingredient.quantity is the quantity of the ingredient
            })),
          },
        },
      },
      include: {
        ProductIngredient: true,
      },
    })

    console.log('Product created: ', createdProduct)

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { product: createdProduct, message: 'Produto criado com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { message: 'Algo de errado aconteceu', error: error.message },
      { status: 500 },
    )
  }
}
