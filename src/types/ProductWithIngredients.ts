import { Ingredient, Product } from '@prisma/client'

export interface ProductWithIngredients extends Product {
  ingredients: Ingredient[]
}
