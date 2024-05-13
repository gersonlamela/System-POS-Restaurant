import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'

// Define o esquema de validação para os dados do pedido
const orderSchema = z.object({
  methodPayment: z.enum(['CASH', 'BANK']),
  nif: z.string().optional(),
  tableNumber: z.number(), // Alterado para string para corresponder ao tipo recebido do formulário
  data: z.string(),
  username: z.string(),
  totalPrice: z.number(),
  orders: z.array(
    z.object({
      productId: z.string(),
      ingredient: z
        .array(
          z.object({
            ingredientId: z.string(),
            quantity: z.number(),
            cookingPreference: z.string().optional(),
          }),
        )
        .optional(),
    }),
  ),
})

// Função para obter o ID do usuário com base no nome de usuário
async function getUserId(username: string): Promise<string> {
  const user = await prisma.user.findFirst({ where: { name: username } })
  if (!user) {
    throw new Error(`User with username ${username} not found`)
  }
  return user.id
}

// Função para obter o ID da mesa com base no número da mesa
async function getTableId(tableNumber: number): Promise<string> {
  const table = await prisma.table.findFirst({ where: { number: tableNumber } })
  if (!table) {
    throw new Error(`Table with number ${tableNumber} not found`)
  }
  return table.id
}

export async function POST(req: Request) {
  try {
    // Receber os dados como JSON
    const body = await req.json()

    // Validar o corpo da solicitação
    const validatedBody = orderSchema.parse(body)

    // Aqui você pode prosseguir com o tratamento dos dados conforme necessário

    // Obter IDs de usuário e mesa
    const userId = await getUserId(validatedBody.username)
    const tableId = await getTableId(validatedBody.tableNumber)

    // Criar a mainOrder primeiro
    const mainOrder = await prisma.order.create({
      data: {
        dataOrder: validatedBody.data,
        NifClient: validatedBody.nif,
        totalPrice: validatedBody.totalPrice,
        status: 'COMPLETED',
        userId,
        tableId,
        PaymentMethod: validatedBody.methodPayment,
      },
    })

    // Criar transação para criar itens de pedido
    await prisma.$transaction(async (prisma) => {
      // Criar itens de pedido para cada produto
      for (const orderItem of validatedBody.orders) {
        const { productId, ingredient } = orderItem

        // Verificar se o produto existe
        const product = await prisma.product.findUnique({
          where: { id: productId },
        })
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`)
        }

        // Criar entrada de pedido para o produto associado à mainOrder
        const order = await prisma.order.create({
          data: {
            dataOrder: validatedBody.data,
            NifClient: validatedBody.nif,
            totalPrice: validatedBody.totalPrice,
            status: 'COMPLETED',
            userId,
            tableId,
            PaymentMethod: validatedBody.methodPayment,
            totalTax: 0,
            productQuantity: 1,
            products: { connect: { id: product.id } },
            orderId: mainOrder.orderId,
          },
        })

        // Se houver ingredientes, criar entradas para os ingredientes associados
        if (ingredient) {
          for (const ing of ingredient) {
            const { ingredientId, quantity, cookingPreference } = ing

            const ingredient = await prisma.ingredient.findUnique({
              where: { id: ingredientId },
            })
            if (!ingredient) {
              throw new Error(`Ingredient with ID ${ingredientId} not found`)
            }

            // Conectar o ingrediente ao item de pedido recém-criado
            await prisma.orderIngredient.create({
              data: {
                orderId: order.id, // Usar o ID da ordem atual
                productId,
                ingredientId,
                cookingPreference,
                quantity,
              },
            })
          }
        }
      }
    })

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
