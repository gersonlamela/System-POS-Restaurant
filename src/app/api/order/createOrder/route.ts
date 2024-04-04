import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { Ingredient, Product, ProductIngredient } from '@prisma/client'
import { getTax } from '@/functions/Product/product'
import console from 'console'

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

const OrderSchema = z.object({
  productId: z.string(),
  ingredient: z.array(
    z.object({
      ingredientId: z.string(),
      quantity: z.number(),
    }),
  ),
})

const orderSchema = z.object({
  nif: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
  userId: z.string().optional(),
  tableId: z.string().optional(),
  orders: z.array(OrderSchema),
})

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { nif, status, userId, tableId, orders } = orderSchema.parse(body)

    console.log(orders.map((order) => order.ingredient))

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

      createdOrders.push(order)

      if (orders.length > 0) {
        const productIngredients = []
        // Iterar sobre cada pedido
        for (const { ingredient } of orders) {
          // Iterar sobre cada ingrediente do pedido
          for (const { ingredientId, quantity } of ingredient || []) {
            // Adicionar os dados do ingrediente ao array de productIngredients
            productIngredients.push({
              ingredientId,
              quantity,
            })
          }
        }

        const orderIngredientsData = productIngredients.map(
          (productIngredient) => ({
            orderId: order.id,
            ingredientId: productIngredient.ingredientId,
            quantity: productIngredient.quantity,
            // Inclua outros campos conforme necessário
          }),
        )

        const orderIngredients = await prisma.orderIngredient.createMany({
          data: orderIngredientsData,
        })
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
