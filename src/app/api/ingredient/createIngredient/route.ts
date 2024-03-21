import { ProductCategory, Tax } from '@prisma/client'
import { writeFile } from 'fs/promises'

import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'
import cuid from 'cuid'
import { prisma } from '@/lib/prisma'
import console from 'console'

const IngredienteSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório.'),
  price: z.number().positive('O preço deve ser um valor positivo.'),
  image: z.string().optional(),
  tax: z.enum(['REDUCED', 'INTERMEDIATE', 'STANDARD']),
  discount: z.number().optional(),
  category: z.enum(['DRINK', 'FOOD', 'DESSERT']),
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

    const file = data.get('file') as File

    const cuidValue = cuid() // Generate cuid value

    // Generate the image path based on category
    const imagePath = `./public/uploads/ingredients/${cuidValue}.${file.name.split('.').pop()}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ImageName = `${cuidValue}.${file.name.split('.').pop()}`

    await writeFile(imagePath, buffer)

    const newIngredient = await prisma.ingredient.create({
      data: {
        name,

        price,
        image: ImageName,
      },
    })

    console.log('Ingredient created: ', newIngredient)

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { ingredient: newIngredient, message: 'Ingredient criado com sucesso' },
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
