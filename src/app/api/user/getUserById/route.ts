// pages/api/getUser.ts
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    // Extract userId from the request body
    const body = await req.json()
    const { userId } = body

    // Check if userId is provided
    if (!userId) {
      return NextResponse.json(
        { message: 'O ID do utilizador é necessário' },
        { status: 400 },
      )
    }

    // Find the user by userId
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        /*    id: true,
        email: true,
        pin: false,
        address: true,
        name: true,
        phone: true,
        role: true, */
      },
    })

    // Check if the user was found
    if (!user) {
      return NextResponse.json(
        { user: null, message: 'Utilizador não encontrado' },
        { status: 404 },
      )
    }

    // Return the user information
    return NextResponse.json(
      { user, message: 'Utilizador encontrado com sucesso' },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Error in getUser route:', error)
    return NextResponse.json(
      { message: 'Algo de errado aconteceu' },
      { status: 500 },
    )
  }
}
