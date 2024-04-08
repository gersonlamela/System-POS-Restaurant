import {
  Ingredient,
  Product as PrismaProduct,
  ProductCategory,
  ProductIngredient,
} from '@prisma/client'

// Defina uma interface para representar um produto

interface Product extends PrismaProduct {
  ProductIngredient: {
    ingredient: Ingredient
    quantity: ProductIngredient['quantity']
  }[]
  ProductCategory: ProductCategory
}

// Defina a interface para representar os produtos com ingredientes
export interface ProductProps {
  Product: Product
}
