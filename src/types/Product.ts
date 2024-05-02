import {
  Ingredient,
  Product as Products,
  ProductCategory,
  ProductIngredient,
} from '@prisma/client'

// Defina uma interface para representar um produto

interface Product extends Products {
  ProductIngredient: {
    ingredient: Ingredient
    quantity: ProductIngredient['quantity']
  }[]
  ProductCategory: ProductCategory
}

export type ProductWithIngredients = Product & {
  productIngredient: {
    ingredient: Ingredient
    quantity: ProductIngredient['quantity']
  }[]
}

export interface ProductIngredients {
  ProductIngredient: ProductIngredient
  ingredients: Ingredient
}

export interface IngredientsProduct {
  productId: string
  ingredientId: string
  maxQuantity: number | null
  quantity: number
  id: string
  ingredient: Ingredient
}
