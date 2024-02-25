// seed.ts

import {
  PrismaClient,
  UserRole,
  ProductCategory,
  UserStatus,
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
        phone: '930678098',
        status: UserStatus.ACTIVE,
        role: UserRole.ADMIN,
      },
    })

    // Create company
    const company1 = await prisma.company.create({
      data: {
        name: 'Company 1',
        email: 'company1@example.com',
        phone: '111-222-3333',
        address: '789 Elm St',
        logo: 'logo1.png',
        users: {
          connect: { id: user1.id },
        },
      },
    })

    // Create products
    const product1 = await prisma.products.create({
      data: {
        name: 'Francesinha',
        price: 25.0,
        image: 'productE.png',
        tax: '5%',
        discount: '2%',
        category: ProductCategory.FOOD,
      },
    })

    const product2 = await prisma.products.create({
      data: {
        name: 'Coca Cola',
        price: 15.0,
        image: 'productF.png',
        tax: '5%',
        discount: '0%',
        category: ProductCategory.DRINK,
      },
    })

    // Create tables
    const table1 = await prisma.tables.create({
      data: {
        number: 1,
        Company: {
          connect: { id: company1.id },
        },
      },
    })

    // Create order with products
    const order1 = await prisma.orders.create({
      data: {
        price: 50.0,
        nif: '123456789',
        tax: '10%',
        products: {
          connect: [{ id: product1.id }, { id: product2.id }],
        },
        tables: {
          connect: { id: table1.id },
        },
        users: {
          connect: { id: user1.id },
        },
      },
    })

    console.log('Seed data created successfully!')
  } catch (error) {
    console.error('Error initializing Prisma client:', error)
    process.exit(1) // Exit with a non-zero status code to indicate an error
  }
  // Exit with a non-zero status code to indicate an error
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
