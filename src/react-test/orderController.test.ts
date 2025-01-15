import { prisma } from '../lib/prisma'
import { PaymentMethod } from '@prisma/client'
// Cria uma instância do PrismaClient

// Teste para criar uma nova ordem usando o Prisma
test('Create new order with Prisma', async () => {
  // Defina os dados da nova ordem
  const orderData = {
    PaymentMethod: 'CASH' as PaymentMethod, // Atribua o tipo PaymentMethod
    NifClient: '123456789',
    tableId: 'clwnramcg000nds8jqer01wit', // ID de mesa existente no banco de dados
    dateOrder: new Date(),
    userId: 'clws4e50y0000c0rdnkx3prwu', // ID de Utilizador existente no banco de dados
    totalPrice: 50.0,
  }
  // Verificar se o ID do Utilizador é válido
  const userExists = await prisma.user.findUnique({
    where: { id: orderData.userId },
  })
  expect(userExists).toBeDefined()
  if (!userExists) {
    throw new Error(`Utilizador com ID ${orderData.userId} não encontrado.`)
  }
  // Verificar se o ID da mesa é válido
  const tableExists = await prisma.table.findUnique({
    where: { id: orderData.tableId },
  })
  expect(tableExists).toBeDefined()
  if (!tableExists) {
    throw new Error(`Mesa com ID ${orderData.tableId} não encontrada.`)
  }
  // Tenta criar uma nova ordem usando o Prisma
  const newOrder = await prisma.order.create({
    data: orderData,
  })
  // Verifica se a nova ordem foi criada com sucesso
  expect(newOrder).toBeDefined()
  // Se a criação da ordem falhar por qualquer motivo, o teste falhará com uma mensagem como:
  // "Expected value to be defined, but received undefined"
  expect(newOrder.PaymentMethod).toEqual(orderData.PaymentMethod)
  expect(newOrder.NifClient).toEqual(orderData.NifClient)
  expect(newOrder.tableId).toEqual(orderData.tableId)
  expect(newOrder.dateOrder).toEqual(orderData.dateOrder)
  expect(newOrder.userId).toEqual(orderData.userId)
  expect(newOrder.totalPrice).toEqual(orderData.totalPrice)
  // Limpa a ordem criada após o teste
  await prisma.order.delete({
    where: { id: newOrder.id },
  })
})
// Fecha a conexão com o Prisma após os testes
afterAll(async () => {
  await prisma.$disconnect()
})
