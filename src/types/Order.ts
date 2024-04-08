import {
  ProductIngredient,
  Ingredient,
  Table,
  Order as PrismaOrder,
  Product,
} from '@prisma/client'
import { User } from 'next-auth'

export interface Order extends PrismaOrder {
  User?: User
  Table?: Table
  products: {
    id: string
    name: string
    ingredients: ProductIngredient[]
    quantity: number
  }[]
  OrderIngredient: {
    ingredient: Ingredient
    quantity: number
    product: Product
  }[] // Aqui está a correção para definir OrderIngredient como uma matriz
}
