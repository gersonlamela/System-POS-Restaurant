import {
  PrismaClient,
  UserStatus,
  Tax,
  OrderStatus,
  UserRole,
  ProductCategory,
} from '@prisma/client'
import { hash } from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
  try {
    const hashedPin = await hash('1234', 10)

    // Criar usuários
    const user1 = await prisma.user.create({
      data: {
        email: 'gersonlamela@example.com',
        pin: hashedPin,
        address: 'Vila Nova de Gaia',
        name: 'Gerson Lamela',
        phone: '930678098', // Adicionando prefixo de código de país para Portugal
        status: UserStatus.ACTIVE,
        role: UserRole.ADMIN,
      },
    })
    const user2 = await prisma.user.create({
      data: {
        email: 'evacruz@example.com',
        pin: hashedPin,
        address: 'Porto',
        name: 'Eva Cruz',
        phone: '930678098', // Adicionando prefixo de código de país para Portugal
        status: UserStatus.ACTIVE,
        role: UserRole.MANAGER,
      },
    })

    const user3 = await prisma.user.create({
      data: {
        email: 'josesilva@example.com',
        pin: hashedPin,
        address: 'Gondomar',
        name: 'José Silva',
        phone: '930678098', // Adicionando prefixo de código de país para Portugal
        status: UserStatus.ACTIVE,
        role: UserRole.EMPLOYEE,
      },
    })

    // Criar empresa
    const company1 = await prisma.company.create({
      data: {
        name: 'Empresa 1', // Nome da empresa em português
        email: 'empresa1@example.com',
        phone: '930678098', // Adicionando prefixo de código de país para Portugal
        address: 'Rua Elm, 789', // Adaptação do endereço para o formato português
        logo: 'logo1.png',
        users: {
          connect: [{ id: user1.id }, { id: user2.id }, { id: user3.id }],
        },
      },
    })

    // Criar ingredientes
    const ingredient1 = await prisma.ingredient.create({
      data: {
        name: 'Pão',
        price: 5.0,
        image: 'pao.png',
      },
    })

    const ingredient2 = await prisma.ingredient.create({
      data: {
        name: 'Carne',
        price: 10.0,
        image: 'carne.png',
      },
    })

    const ingredient3 = await prisma.ingredient.create({
      data: {
        name: 'Coca Cola',
        price: 5.0,
        image: 'coca-cola.png',
      },
    })

    const ingredient4 = await prisma.ingredient.create({
      data: {
        name: 'Gelo',
        price: 2.0,
        image: 'gelo.png',
      },
    })

    // Criar produtos
    const product1 = await prisma.product.create({
      data: {
        name: 'Francesinha',
        price: 25.0,
        image: 'produtoE.png', // Nome do arquivo de imagem em português
        tax: Tax.INTERMEDIATE, // Adaptação da taxa para o português
        discount: 2,
        category: ProductCategory.DESSERT, // Utilizando a categoria em português
        productIngredients: {
          create: [
            { ingredientId: ingredient1.id, quantity: 1, maxQuantity: 5 },
            { ingredientId: ingredient2.id, quantity: 1, maxQuantity: 2 },
          ],
        },
      },
    })

    const product2 = await prisma.product.create({
      data: {
        name: 'Coca Cola',
        price: 15.0,
        image: 'produtoF.png', // Nome do arquivo de imagem em português
        tax: Tax.INTERMEDIATE, // Adaptação da taxa para o português
        category: ProductCategory.DRINK, // Utilizando a categoria em português
        productIngredients: {
          create: [
            { ingredientId: ingredient3.id, quantity: 1, maxQuantity: 3 },
            { ingredientId: ingredient4.id, quantity: 1, maxQuantity: 2 },
          ],
        },
      },
    })

    // Criar mesas
    const table1 = await prisma.table.create({
      data: {
        number: 1,
        company: {
          connect: { id: company1.id },
        },
      },
    })

    // Criar pedido com produtos
    const order1 = await prisma.order.create({
      data: {
        totalPrice: 50.0,
        nif: '123456789', // Exemplo de número de identificação fiscal em Portugal
        status: OrderStatus.PENDING, // Estado da ordem em português
        products: {
          connect: [{ id: product1.id }, { id: product2.id }],
        },
        Table: {
          connect: { id: table1.id },
        },
        User: {
          connect: { id: user1.id },
        },
        OrderIngredient: {
          create: [
            { ingredientId: ingredient3.id, quantity: 1, maxQuantity: 3 },
            { ingredientId: ingredient4.id, quantity: 1, maxQuantity: 2 },
          ],
        },
      },
    })

    console.log('Dados de seed criados com sucesso!')
  } catch (error) {
    console.error('Erro ao inicializar o cliente Prisma:', error)
    process.exit(1) // Sair com um código de status diferente de zero para indicar um erro
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  throw e
})
