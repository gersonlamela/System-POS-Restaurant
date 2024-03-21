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
        { message: 'ID do ingrediente não fornecido' },
        { status: 400 },
      )
    }

    const deletedIngredient = await prisma.ingredient.delete({
      where: { id },
    })

    console.log('Ingredient Deleted: ', deletedIngredient)

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { message: 'Ingrediente eliminado com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Error deleating ingredient:', error)
    return NextResponse.json(
      { message: 'Algo de errado aconteceu', error: error.message },
      { status: 500 },
    )
  }
}
