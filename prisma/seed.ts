import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt' // Importando o módulo bcrypt-ts de uma forma compatível com CommonJS

const prisma = new PrismaClient()

async function main() {
  try {
    const saltRounds = 10
    const hashedPin = await bcrypt.hash('1234', saltRounds)

    await prisma.user.create({
      data: {
        email: 'teste@teste.com',
        pin: hashedPin,
        address: 'Porto',
        name: 'Teste teste',
        phone: '912345678',
        status: 'ACTIVE',
        role: 'MANAGER',
      },
    })

    // Criar empresa
    await prisma.company.create({
      data: {
        name: 'Empresa 1', // Nome da empresa em português
        email: 'empresa1@example.com',
        phone: '930678098',
        address: 'Rua Elm, 789', // Adaptação do endereço para o formato português
        logo: 'logo1.png',
        capitalSocial: 100000.0,
        nif: '123456789',
      },
    })

    // Criar ingredientes
    const ingredient1 = await prisma.ingredient.create({
      data: {
        name: 'Pão',
        image: 'pao.png',
      },
    })

    const ingredient2 = await prisma.ingredient.create({
      data: {
        name: 'Carne',
        image: 'carne.png',
      },
    })

    const ingredient4 = await prisma.ingredient.create({
      data: {
        name: 'Gelo',
        image: 'gelo.png',
      },
    })

    // Criar categorias de produtos
    const categories = [
      { name: 'Entradas', icon: 'fork-knife.svg' },
      { name: 'Sopas', icon: 'cooking-pot.svg' },
      { name: 'Hamburguers', icon: 'hamburger.svg' },
      { name: 'Acompanhamentos', icon: 'bowl-stream.svg' },
      { name: 'Bebidas', icon: 'beer-bottle.svg' },
      { name: 'Sobremesas', icon: 'ice-cream.svg' },
    ]

    const createdCategories = []

    for (const category of categories) {
      const createdCategory = await prisma.productCategory.create({
        data: category,
      })
      createdCategories.push(createdCategory)
    }

    const category1 = createdCategories.find((cat) => cat.name === 'Entradas')
    const category2 = createdCategories.find(
      (cat) => cat.name === 'Hamburguers',
    )
    const category3 = createdCategories.find((cat) => cat.name === 'Bebidas')
    const category4 = createdCategories.find(
      (cat) => cat.name === 'Acompanhamentos',
    )
    const category5 = createdCategories.find((cat) => cat.name === 'Sobremesas')
    const category6 = createdCategories.find((cat) => cat.name === 'Sopas')

    // Criar produtos
    await prisma.product.create({
      data: {
        name: 'Hamburger',
        price: 25.0,
        image: 'produtoE.png', // Nome do arquivo de imagem em português
        tax: 'INTERMEDIATE', // Adaptação da taxa para o português
        discount: 2,
        productCategoryId: category1?.id,
        ProductIngredient: {
          create: [
            { ingredientId: ingredient1.id, quantity: 1, maxQuantity: 5 },
            { ingredientId: ingredient2.id, quantity: 1, maxQuantity: 2 },
          ],
        },
      },
    })

    await prisma.product.create({
      data: {
        name: 'Coca Cola',
        price: 15.0,
        image: 'produtoF.png', // Nome do arquivo de imagem em português
        tax: 'INTERMEDIATE', // Adaptação da taxa para o português
        productCategoryId: category2?.id,
        ProductIngredient: {
          create: [
            { ingredientId: ingredient4.id, quantity: 1, maxQuantity: 2 },
          ],
        },
      },
    })

    await prisma.table.createMany({
      data: [
        {
          number: 1,
        },
        {
          number: 2,
        },
        {
          number: 3,
        },
        {
          number: 4,
        },
        {
          number: 5,
        },
        {
          number: 6,
        },
        {
          number: 7,
        },
        {
          number: 8,
        },
        {
          number: 9,
        },
        {
          number: 10,
        },
        {
          number: 11,
        },
        {
          number: 12,
        },
        {
          number: 13,
        },
        {
          number: 14,
        },
      ],
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
