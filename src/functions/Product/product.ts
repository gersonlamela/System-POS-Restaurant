import { Products } from '@prisma/client'

export function getTax(role: Products['tax']) {
  switch (role) {
    case 'REDUCED':
      return '6%'
    case 'INTERMEDIATE':
      return '13%'
    case 'STANDARD':
      return '23%'
  }
}

export function getCategory(role: Products['category']) {
  switch (role) {
    case 'DESSERT':
      return 'sobremesas'
    case 'DRINK':
      return 'bebidas'
    case 'FOOD':
      return 'comida'
  }
}
