import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'

// Define o esquema de validação para os dados do pedido
const orderSchema = z.object({
  methodPayment: z.enum(['CASH', 'BANK']),
  nif: z.string().optional(),
  tableNumber: z.number(), // Alterado para string para corresponder ao tipo recebido do formulário
  date: z.string().pipe(z.coerce.date()),
  username: z.string(),
  totalPrice: z.number(),
  orders: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(), // Alterado para opcional
      ingredients: z
        .array(
          z.object({
            ingredientId: z.string(),
            cookingPreference: z.string().optional(),
          }),
        )
        .optional(), // Alterado para opcional
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
async function getTableId(tableNumber: string): Promise<string> {
  const table = await prisma.table.findFirst({
    where: { number: parseInt(tableNumber) },
  }) // Parse para int
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
    const tableId = await getTableId(validatedBody.tableNumber.toString())

    const mainOrder = await prisma.order.create({
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

    console.log(
      'isto é um validate',
      validatedBody.orders.map((order) => order.ingredients),
    )
    // Criar transação para criar itens de pedido
    await prisma.$transaction(async (prisma) => {
      // Criar itens de pedido para cada produto
      for (const orderItem of validatedBody.orders) {
        const { productId, quantity = 1, ingredients = [] } = orderItem // Definir valor padrão para quantity e ingredients

        // Verificar se o produto existe
        const product = await prisma.product.findUnique({
          where: { id: productId },
        })
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`)
        }

        // Criar entrada de pedido para o produto associado à mainOrder
        const createdOrderProduct = await prisma.orderProduct.create({
          data: {
            quantity,
            product: { connect: { id: productId } },
            order: { connect: { id: mainOrder.id } },
          },
        })

        // Verificar se há ingredientes antes de criar a associação
        if (ingredients.length > 0) {
          // Criar os ingredientes e associá-los ao item de pedido
          await prisma.orderIngredient.createMany({
            data: ingredients.map((ingredient) => ({
              ingredientId: ingredient.ingredientId,
              cookingPreference: ingredient.cookingPreference,
              orderProductId: createdOrderProduct.id,
            })),
          })
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
