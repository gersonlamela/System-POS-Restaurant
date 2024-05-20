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
        { message: 'ID do pedido não fornecido' },
        { status: 400 },
      )
    }

    // Deleta o produto com o id fornecido
    const deletedOrder = await prisma.order.delete({
      where: { id },
    })

    console.log('Order Deleted: ', deletedOrder)

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { message: 'Pedido eliminado com sucesso' },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Error deleating order:', error)
    return NextResponse.json(
      { message: 'Algo de errado aconteceu', error: error.message },
      { status: 500 },
    )
  }
}
