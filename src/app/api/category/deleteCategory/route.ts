import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function DELETE(req: Request) {
  console.log(req)
  const { searchParams } = new URL(req.url)
  try {
    const id = searchParams.get('id')

    console.log(id)

    if (!id) {
      return NextResponse.json(
        { message: 'ID da categoria não fornecido' },
        { status: 400 },
      )
    }

    const deletedCategory = await prisma.productCategory.delete({
      where: { id },
    })

    console.log('Category Deleted: ', deletedCategory)

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { message: 'Categoria eliminada com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Error deleating category:', error)
    return NextResponse.json(
      { message: 'Algo de errado aconteceu', error: error.message },
      { status: 500 },
    )
  }
}
