import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function DELETE(req: Request) {
  console.log(req)
  const { searchParams } = new URL(req.url)
  try {
    const id = searchParams.get('id')

    console.log(id)

    // Verifica se o id foi fornecido
    if (!id) {
      return NextResponse.json(
        { message: 'ID do produto não fornecido' },
        { status: 400 },
      )
    }

    // Deleta o produto com o id fornecido
    const deletedProduct = await prisma.product.delete({
      where: { id },
    })

    console.log('Product Deleted: ', deletedProduct)

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { message: 'Produto eliminado com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Error deleating product:', error)
    return NextResponse.json(
      { message: 'Algo de errado aconteceu', error: error.message },
      { status: 500 },
    )
  }
}
