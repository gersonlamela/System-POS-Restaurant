import { Product, ProductCategory } from '@prisma/client'

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

    return data.product
  }

  // Handle non-ok response
  console.error('Error fetching products:', result.statusText)
  return []
}
export async function handleGetProductsByCategoryId(
  categoryId: ProductCategory['id'],
) {
  try {
    if (!categoryId) {
      throw new Error('Category ID is required')
    }

    const result = await fetch(
      `http://localhost:3000/api/product/getProductByCategoryId?id=${categoryId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!result.ok) {
      throw new Error(`Failed to fetch products: ${result.statusText}`)
    }

    const responseBody = await result.text()

    // Verifica se a resposta tem um corpo
    if (!responseBody.trim()) {
      throw new Error('Empty response body')
    }

    const data = JSON.parse(responseBody)

    // Verifica se a resposta contém a chave 'products'
    if (!data.products) {
      throw new Error('Response does not contain products')
    }

    return data.products
  } catch (error) {
    console.error('Error fetching products:', error)
    // Retorne uma lista vazia ou lance o erro para tratamento externo
    throw error
  }
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

    return data.CategoryProducts
  }

  console.error('Error fetching category products:', result.statusText)
  return []
}

export async function handleGetCategoryByCategoryId(
  categoryId: ProductCategory['id'],
) {
  try {
    if (!categoryId) {
      throw new Error('Category ID is required')
    }

    const result = await fetch(
      `http://localhost:3000/api/category/getCategory?id=${categoryId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!result.ok) {
      throw new Error(`Failed to fetch category: ${result.statusText}`)
    }

    const responseBody = await result.text()

    // Verifica se a resposta tem um corpo
    if (!responseBody.trim()) {
      throw new Error('Empty response body')
    }

    const data = JSON.parse(responseBody)

    // Verifica se a resposta contém a chave 'products'
    if (!data.category) {
      throw new Error('Response does not contain products')
    }

    return data.category
  } catch (error) {
    console.error('Error fetching products:', error)
    // Retorne uma lista vazia ou lance o erro para tratamento externo
    throw error
  }
}
