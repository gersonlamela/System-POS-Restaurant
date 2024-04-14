import { PrismaClient } from '@prisma/client'
import { genSaltSync, hashSync } from 'bcrypt-ts'

const prisma = new PrismaClient()

async function main() {
  try {
    const salt = genSaltSync(10)
    const hashedPin = hashSync('1234', salt)

    // Criar usuários
    const user1 = await prisma.user.create({
      data: {
        email: 'gersonlamela@example.com',
        pin: hashedPin,
        address: 'Vila Nova de Gaia',
        name: 'Gerson Lamela',
        phone: '930678098', // Adicionando prefixo de código de país para Portugal
        status: 'ACTIVE',
        role: 'ADMIN',
      },
    })
    const user2 = await prisma.user.create({
      data: {
        email: 'evacruz@example.com',
        pin: hashedPin,
        address: 'Porto',
        name: 'Eva Cruz',
        phone: '930678098', // Adicionando prefixo de código de país para Portugal
        status: 'ACTIVE',
        role: 'MANAGER',
      },
    })

    const user3 = await prisma.user.create({
      data: {
        email: 'josesilva@example.com',
        pin: hashedPin,
        address: 'Gondomar',
        name: 'José Silva',
        phone: '930678098', // Adicionando prefixo de código de país para Portugal
        status: 'ACTIVE',
        role: 'EMPLOYEE',
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

    // Criar categorias de produtos
    const category1 = await prisma.productCategory.create({
      data: {
        name: 'Prato Principal',
        icon: 'icon1.png',
      },
    })

    const category2 = await prisma.productCategory.create({
      data: {
        name: 'Bebida',
        icon: 'icon2.png',
      },
    })

    // Criar produtos
    const product1 = await prisma.product.create({
      data: {
        name: 'Francesinha',
        price: 25.0,
        image: 'produtoE.png', // Nome do arquivo de imagem em português
        tax: 'INTERMEDIATE', // Adaptação da taxa para o português
        discount: 2,
        productCategoryId: category1.id,
        ProductIngredient: {
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
        tax: 'INTERMEDIATE', // Adaptação da taxa para o português
        productCategoryId: category2.id,
        ProductIngredient: {
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
