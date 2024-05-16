import { Order as PrismaOrder, Table, User, Ingredient } from '@prisma/client'

export interface Order extends PrismaOrder {
  User?: User
  Table?: Table
  OrderProduct: {
    id: string
    quantity: number
    productId: string
    orderId: string
    OrderIngredient: {
      id: string
      ingredient: Ingredient
      cookingPreference?: string
    }[]
  }[]
}
