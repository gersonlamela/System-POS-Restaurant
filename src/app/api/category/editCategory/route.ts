import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Tax, ProductCategory } from '@prisma/client'
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

    const existingCategory = await prisma.productCategory.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Categoria não encontrada' },
        { status: 404 },
      )
    }

    if (!file || !file.name) {
      await prisma.productCategory.update({
        where: { id },
        data: {
          name,
        },
      })
    } else {
      const cuidValue = cuid()

      const extIndex = file.name.lastIndexOf('.')
      const ext = extIndex >= 0 ? file.name.slice(extIndex) : ''
      const imagePath = `./public/uploads/icons/${cuidValue}${ext}`
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      await writeFile(imagePath, buffer)

      // Atualiza o produto com a nova imagem
      await prisma.productCategory.update({
        where: { id },
        data: {
          name,
          icon: `${cuidValue}${ext}`,
        },
      })
    }

    return NextResponse.json(
      { message: 'Categoria atualizada com sucesso' },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Erro ao atualizar categoria:', error)
    return NextResponse.json(
      {
        message: 'Algo deu errado ao atualizar a categoria',
        error: error.message,
      },
      { status: 500 },
    )
  }
}
