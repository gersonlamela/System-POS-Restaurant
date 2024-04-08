import { Product } from '@prisma/client'

export function getTax(role: Product['tax']) {
  switch (role) {
    case 'REDUCED':
      return 6
    case 'INTERMEDIATE':
      return 13
    case 'STANDARD':
      return 23
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

export async function handleGetProductsCategory() {
  const result = await fetch(
    'http://localhost:3000/api/product/getProductsCategory',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (result.ok) {
    const data = await result.json()

    console.log('data:', data)

    return data.CategoryProducts
  }

  // Handle non-ok response
  console.error('Error fetching category products:', result.statusText)
  return []
}
