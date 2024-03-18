import {
  PrismaClient,
  UserRole,
  ProductCategory,
  UserStatus,
  Tax,
  OrderStatus,
} from '@prisma/client'
import { hash } from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
  try {
    const hashedPin = await hash('1234', 10)

    // Create users
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

    // Create company
    const company1 = await prisma.company.create({
      data: {
        name: 'Empresa 1', // Nome da empresa em português
        email: 'empresa1@example.com',
        phone: '930678098', // Adicionando prefixo de código de país para Portugal
        address: 'Rua Elm, 789', // Adaptação do endereço para o formato português
        logo: 'logo1.png',
        users: {
          connect: { id: user1.id },
        },
      },
    })

    // Create products
    const product1 = await prisma.product.create({
      data: {
        name: 'Francesinha',
        price: 25.0,
        image: 'produtoE.png', // Nome do arquivo de imagem em português
        tax: Tax.INTERMEDIATE, // Adaptação da taxa para o português
        discount: 2,
        category: ProductCategory.DESSERT, // Utilizando a categoria em português
        ingredients: {
          create: [
            { name: 'Pão', price: 5.0 },
            { name: 'Carne', price: 10.0 },
          ], // Adicionando ingredientes
        },
      },
    })

    const product2 = await prisma.product.create({
      data: {
        name: 'Coca Cola',
        price: 15.0,
        image: 'produtoF.png', // Nome do arquivo de imagem em português
        tax: Tax.INTERMEDIATE, // Adaptação da taxa para o português
        discount: 0,
        category: ProductCategory.DRINK, // Utilizando a categoria em português
        ingredients: {
          create: [
            { name: 'Coca Cola', price: 5.0 },
            { name: 'Gelo', price: 2.0 },
          ], // Adicionando ingredientes
        },
      },
    })

    // Create tables
    const table1 = await prisma.table.create({
      data: {
        number: 1,
        company: {
          connect: { id: company1.id },
        },
      },
    })

    // Create order with products
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
