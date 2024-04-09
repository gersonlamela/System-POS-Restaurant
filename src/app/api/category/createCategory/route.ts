import { ProductCategory, Tax } from '@prisma/client'
import { writeFile } from 'fs/promises'

import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'
import cuid from 'cuid'
import { prisma } from '@/lib/prisma'
import console from 'console'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  console.log(data)

  if (!file) {
    return NextResponse.json({ success: false })
  }

  try {
    const name = data.get('name') as string

    const file = data.get('file') as File

    const cuidValue = cuid() // Generate cuid value

    // Generate the image path based on category
    const imagePath = `./public/uploads/icons/${cuidValue}.${file.name.split('.').pop()}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ImageName = `${cuidValue}.${file.name.split('.').pop()}`

    await writeFile(imagePath, buffer)

    const newCategory = await prisma.productCategory.create({
      data: {
        name,
        icon: ImageName,
      },
    })

    console.log('Category created: ', newCategory)

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { ingredient: newCategory, message: 'Categoria criado com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { message: 'Algo de errado aconteceu', error: error.message },
      { status: 500 },
    )
  }
}
