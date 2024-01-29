// seed.ts

import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
async function main() {
  try {
    // Create users
    const user1 = await prisma.user.create({
      data: {
        email: 'user1@example.com',
        pin: '1234',
        address: '123 Main St',
        name: 'User 1',
        phone: '123-456-7890',
        role: UserRole.EMPLOYEE,
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
        name: 'Product E',
        price: 25.0,
        image: 'productE.png',
        tax: '5%',
        discount: '2%',
      },
    })

    const product2 = await prisma.products.create({
      data: {
        name: 'Product F',
        price: 15.0,
        image: 'productF.png',
        tax: '5%',
        discount: '0%',
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
