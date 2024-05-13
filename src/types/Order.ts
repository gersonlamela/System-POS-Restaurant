import {
  Ingredient,
  Table,
  Order as PrismaOrder,
  Product,
  User,
} from '@prisma/client'

export interface Order extends PrismaOrder {
  User?: User
  Table?: Table
  OrderIngredient: {
    ingredient: Ingredient[]
    orderId: string
    quantity: number
    product: Product
    cookingPreference?: string
  }[] // Aqui está a correção para definir OrderIngredient como uma matriz
}
