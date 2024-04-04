// pages/api/createOrder.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { Ingredient, Product } from '@prisma/client'
import { getTax } from '@/functions/Product/product'

const calculateTotalPrice = (product: Product): number => {
  if (typeof product.price === 'number') {
    const tax = getTax(product.tax)
    let totalPrice = product.price * (1 + tax / 100)

    if (typeof product.discount === 'number') {
      totalPrice *= 1 - product.discount / 100
    }

    return totalPrice
  }

  return 0
}

const orderSchema = z.object({
  nif: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
  userId: z.string().optional(),
  tableId: z.string().optional(),
  orders: z.array(
    z.object({
      productId: z.string(),
      ingredientIds: z.array(z.string()).optional(),
    }),
  ),
})

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { nif, status, userId, tableId, orders } = orderSchema.parse(body)

    const mainOrder = await prisma.order.create({
      data: {
        totalPrice: 0,
        nif,
        status,
        userId,
        tableId,
      },
    })

    const createdOrders = []

    for (const { productId, ingredientIds } of orders) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      })

      if (!product) {
        throw new Error(`Product with ID ${productId} not found`)
      }

      const totalPrice = calculateTotalPrice(product)

      const orderData = {
        orderId: mainOrder.orderId,
        totalPrice,
        nif,
        status,
        userId,
        tableId,
        products: {
          connect: { id: product.id },
        },
      }

      const order = await prisma.order.create({
        data: orderData,
      })

      // Adicionar os ingredientes à ordem
      if (ingredientIds) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            ingredients: {
              connect: ingredientIds.map((ingredientId) => ({
                id: ingredientId,
              })),
            },
          },
        })
      }

      createdOrders.push(order)
    }

    return NextResponse.json(
      { orders: createdOrders, message: 'Orders created successfully' },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { message: 'Something went wrong while creating the order' },
      { status: 500 },
    )
  }
}
