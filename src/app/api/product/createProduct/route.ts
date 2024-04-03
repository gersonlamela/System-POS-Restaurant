import { ProductCategory, Tax } from '@prisma/client'
import { writeFile } from 'fs/promises'

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
  category: z.enum(['DRINK', 'FOOD', 'DESSERT']),
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

    const category = data.get('category') as ProductCategory
    const ingredients = JSON.parse(
      data.get('ingredients') as string,
    ) as string[]
    const file = data.get('file') as File

    const cuidValue = cuid() // Generate cuid value

    // Define the category-specific directory
    let categoryDirectory = ''
    if (category === 'FOOD') {
      categoryDirectory = 'food'
    } else if (category === 'DRINK') {
      categoryDirectory = 'drinks'
    } else if (category === 'DESSERT') {
      categoryDirectory = 'desserts'
    }

    // Generate the image path based on category
    const imagePath = `./public/uploads/products/${categoryDirectory}/${cuidValue}.${file.name.split('.').pop()}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ImageName = `${cuidValue}.${file.name.split('.').pop()}`

    await writeFile(imagePath, buffer)

    console.log('Stock ', stock)

    const newProduct = await prisma.product.create({
      data: {
        name,
        category,
        price,
        image: ImageName,
        tax,
        discount,
        stock,
        ingredients: {
          connect: ingredients.map((ingredientId) => ({ id: ingredientId })),
        },
      },
    })

    console.log('Product created: ', newProduct)

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { user: newProduct, message: 'Produto criado com sucesso' },
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
