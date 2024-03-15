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
    const price = parseFloat(data.get('price') as string)
    const tax = data.get('tax') as Tax
    const discount = parseInt(data.get('discount') as string) || undefined
    const category = data.get('category') as ProductCategory
    const existingProduct = await prisma.product.findUnique({ where: { id } })

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 },
      )
    }

    // Se não há arquivo enviado ou a imagem enviada é igual à imagem existente
    if (!file || !file.name) {
      await prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          tax,
          discount,
          category,
        },
      })
    } else {
      const cuidValue = cuid() // Generate cuid value

      // Define o diretório baseado na categoria
      let categoryDirectory = ''
      if (category === 'FOOD') {
        categoryDirectory = 'food'
      } else if (category === 'DRINK') {
        categoryDirectory = 'drinks'
      } else if (category === 'DESSERT') {
        categoryDirectory = 'desserts'
      }

      // Caminho da imagem
      const extIndex = file.name.lastIndexOf('.')
      const ext = extIndex >= 0 ? file.name.slice(extIndex) : ''
      const imagePath = `./public/uploads/${categoryDirectory}/${cuidValue}${ext}`
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      await writeFile(imagePath, buffer)

      // Atualiza o produto com a nova imagem
      await prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          image: `${cuidValue}${ext}`,
          tax,
          discount,
          category,
        },
      })
    }

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
