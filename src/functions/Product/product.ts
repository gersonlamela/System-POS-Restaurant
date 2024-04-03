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

export async function handleGetProducts() {
  const result = await fetch('http://localhost:3000/api/product/getProducts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (result.ok) {
    const data = await result.json()

    console.log('data:', data)

    return data.product
  }

  // Handle non-ok response
  console.error('Error fetching products:', result.statusText)
  return []
}
