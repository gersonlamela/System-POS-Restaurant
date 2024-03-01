import { prisma } from '@/lib/prisma'
import { ProductCategory, Tax } from '@prisma/client'
import { writeFile } from 'fs/promises'
import { request } from 'http'
import error from 'next/error'
import image from 'next/image'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { any, z } from 'zod'

const ProductSchema = z.object({
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
    const tax = data.get('tax') as Tax
    const discount = parseInt(data.get('discount') as string) || undefined
    const category = data.get('category') as ProductCategory
    const file = data.get('file') as File

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const imagePath = `./public/uploads/${file.name}`
    await writeFile(imagePath, buffer)
    console.log(`open ${imagePath} to see the uploaded file`)

    const newProduct = await prisma.products.create({
      data: {
        name,
        category,
        price,
        image: file.name,
        tax,
        discount,
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
