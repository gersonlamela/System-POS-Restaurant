import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  try {
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID do utilizador não fornecido' },
        { status: 400 },
      )
    }

    const deletedUser = await prisma.user.delete({
      where: { id },
    })

    console.log('User Deleted: ', deletedUser)

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { message: 'Utilizador eliminado com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Error deleating user:', error)
    return NextResponse.json(
      { message: 'Algo de errado aconteceu', error: error.message },
      { status: 500 },
    )
  }
}
