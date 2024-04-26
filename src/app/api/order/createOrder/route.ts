import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Product } from '@prisma/client'
import { getTax } from '@/functions/Product/product'

const calculateTotalPrice = (
  product: Product,
  ingredients: { ingredientId: string; quantity: number }[] = [],
): number => {
  if (typeof product.price === 'number') {
    const tax = getTax(product.tax)
    let totalPrice = product.price * (1 + tax / 100)

    // Adicionando o preço dos ingredientes ao preço total
    ingredients.forEach(async ({ ingredientId, quantity }) => {
      const ingredient = await prisma.ingredient.findUnique({
        where: { id: ingredientId },
      })

      if (ingredient && typeof ingredient.price === 'number') {
        totalPrice += ingredient.price * quantity
      }
    })

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
      ingredient: z
        .array(
          z.object({
            ingredientId: z.string(),
            quantity: z.number(),
          }),
        )
        .optional(),
    }),
  ),
})

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { nif, status, userId, tableId, orders } = orderSchema.parse(body)

    // Cria a ordem principal
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

    for (const { productId, ingredient } of orders) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      })

      if (!product) {
        throw new Error(`Product with ID ${productId} not found`)
      }

      const totalPrice = calculateTotalPrice(product, ingredient || [])

      // Cria uma entrada de pedido para cada produto
      const order = await prisma.order.create({
        data: {
          orderId: mainOrder.orderId, // Utiliza o ID real da ordem principal
          totalPrice,
          nif,
          status,
          userId,
          tableId,
          products: {
            connect: { id: product.id },
          },
        },
      })

      createdOrders.push(order)

      // Cria entradas de ingredientes associadas a cada produto
      for (const { productId, ingredient } of orders) {
        const product = await prisma.product.findUnique({
          where: { id: productId },
        })

        if (!product) {
          throw new Error(`Product with ID ${productId} not found`)
        }

        const totalPrice = calculateTotalPrice(product, ingredient || [])

        // Cria uma entrada de pedido para o produto
        const order = await prisma.order.create({
          data: {
            orderId: mainOrder.orderId, // Utiliza o ID real da ordem principal
            totalPrice,
            nif,
            status,
            userId,
            tableId,
            products: {
              connect: { id: product.id },
            },
          },
        })

        createdOrders.push(order)

        // Cria entradas de ingredientes associadas ao produto
        for (const { productId, ingredientId, quantity } of order || []) {
          await prisma.orderIngredient.create({
            data: {
              orderId: order.orderId.toString(), // Utiliza o ID real da ordem criada acima
              productId,
              ingredientId
              quantity,
            },
          })
        }
      }
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
