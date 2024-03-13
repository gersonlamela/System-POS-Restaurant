import { Product } from '@prisma/client'

export function getTax(role: Product['tax']) {
  switch (role) {
    case 'REDUCED':
      return '6%'
    case 'INTERMEDIATE':
      return '13%'
    case 'STANDARD':
      return '23%'
  }
}

export function getCategory(role: Product['category']) {
  switch (role) {
    case 'DESSERT':
      return 'sobremesas'
    case 'DRINK':
      return 'bebidas'
    case 'FOOD':
      return 'comida'
  }
}

export function getCategoryDirectory(category: Product['category']) {
  switch (category) {
    case 'FOOD':
      return 'food'
    case 'DRINK':
      return 'drinks'
    case 'DESSERT':
      return 'desserts'
    default:
      return '' // handle default or unknown category
  }
}
