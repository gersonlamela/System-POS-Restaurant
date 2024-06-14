import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'

// Define o esquema de validação para os dados do pedido
const orderSchema = z.object({
  methodPayment: z.enum(['CASH', 'BANK']),
  nif: z.string().optional(),
  tableNumber: z.number(),
  date: z.string().pipe(z.coerce.date()),
  username: z.string(),
  totalPrice: z.number(),
  orders: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().optional(),
      ingredients: z
        .array(
          z.object({
            ingredientId: z.string(),
            cookingPreference: z.string().optional(),
          }),
        )
        .optional(),
    }),
  ),
})

// Função para obter o ID do Utilizador com base no nome de Utilizador
async function getUserId(username: string): Promise<string> {
  const user = await prisma.user.findFirst({ where: { name: username } })
  if (!user) {
    throw new Error(`User with username ${username} not found`)
  }
  return user.id
}

// Função para obter o ID da mesa com base no número da mesa
async function getTableId(tableNumber: string): Promise<string> {
  const table = await prisma.table.findFirst({
    where: { number: parseInt(tableNumber) },
  })
  if (!table) {
    throw new Error(`Table with number ${tableNumber} not found`)
  }
  return table.id
}

export async function POST(req: Request) {
  try {
    const body = await req.json() // Receber os dados como JSON
    const validatedBody = orderSchema.parse(body) // Validar o corpo da solicitação
    // Obter IDs de Utilizador e mesa
    const userId = await getUserId(validatedBody.username)
    const tableId = await getTableId(validatedBody.tableNumber.toString())

    // Criar transação para criar a ordem e seus itens
    await prisma.$transaction(
      async (transactionPrisma) => {
        // Criar a ordem principal
        const mainOrder = await transactionPrisma.order.create({
          data: {
            dateOrder: validatedBody.date,
            NifClient: validatedBody.nif,
            totalPrice: validatedBody.totalPrice,
            status: 'COMPLETED',
            userId,
            tableId,
            PaymentMethod: validatedBody.methodPayment,
          },
        })

        // Criar itens de pedido para cada produto
        for (const orderItem of validatedBody.orders) {
          const { productId, quantity = 1, ingredients = [] } = orderItem

          // Verificar se o produto existe
          const product = await transactionPrisma.product.findUnique({
            where: { id: productId },
          })
          if (!product) {
            throw new Error(`Product with ID ${productId} not found`)
          }

          // Criar entrada de pedido para o produto associado à mainOrder
          const createdOrderProduct =
            await transactionPrisma.orderProduct.create({
              data: {
                quantity,
                product: { connect: { id: productId } },
                order: { connect: { id: mainOrder.id } },
              },
            })

          // Verificar se há ingredientes antes de criar a associação
          if (ingredients.length > 0) {
            // Criar os ingredientes e associá-los ao item de pedido
            await transactionPrisma.orderIngredient.createMany({
              data: ingredients.map((ingredient) => ({
                ingredientId: ingredient.ingredientId,
                cookingPreference: ingredient.cookingPreference,
                orderProductId: createdOrderProduct.id,
              })),
            })
          }
        }
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      },
    )

    return NextResponse.json(
      {
        message: 'Order created successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating order:', error)

    if (error instanceof ZodError) {
      const validationErrors = error.errors.map((err) => ({
        message: err.message,
        path: err.path.join('.'),
        code: err.code,
      }))

      return NextResponse.json(
        { message: 'Invalid request data', details: validationErrors },
        { status: 400 },
      )
    } else if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Database error', details: error.message },
        { status: 500 },
      )
    } else {
      return NextResponse.json(
        { message: 'Something went wrong while creating the order' },
        { status: 500 },
      )
    }
  }
}
