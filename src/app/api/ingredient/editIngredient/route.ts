import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import cuid from 'cuid'
import { writeFile } from 'fs/promises'

export async function PUT(request: NextRequest) {
  const data = await request.formData()
  const { searchParams } = new URL(request.url)
  const file: File | null = data.get('file') as unknown as File

  console.log(data)

  try {
    const id = searchParams.get('id') as string
    const name = data.get('name') as string
    const stock = parseFloat(data.get('stock') as string)

    const existingIngredient = await prisma.ingredient.findUnique({
      where: { id },
    })

    if (!existingIngredient) {
      return NextResponse.json(
        { message: 'Ingrediente não encontrado' },
        { status: 404 },
      )
    }

    // Se não há arquivo enviado ou a imagem enviada é igual à imagem existente
    if (!file || !file.name) {
      await prisma.ingredient.update({
        where: { id },
        data: {
          name,
          stock,
        },
      })
    } else {
      const cuidValue = cuid() // Generate cuid value

      // Caminho da imagem
      const extIndex = file.name.lastIndexOf('.')
      const ext = extIndex >= 0 ? file.name.slice(extIndex) : ''
      const imagePath = `./public/uploads/ingredients/${cuidValue}${ext}`
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      await writeFile(imagePath, buffer)

      // Atualiza o produto com a nova imagem
      await prisma.ingredient.update({
        where: { id },
        data: {
          name,
          stock,
          image: `${cuidValue}${ext}`,
        },
      })
    }

    return NextResponse.json(
      { message: 'Ingrediente atualizado com sucesso' },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Erro ao atualizar ingrediente:', error)
    return NextResponse.json(
      {
        message: 'Algo deu errado ao atualizar o ingrediente',
        error: error.message,
      },
      { status: 500 },
    )
  }
}
