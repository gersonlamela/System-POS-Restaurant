import { Product } from '@prisma/client'

export async function handleGetIngredients() {
  const result = await fetch(
    'http://localhost:3000/api/ingredient/getIngredients',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (result.ok) {
    const data = await result.json()

    return data.ingredients
  }

  // Handle non-ok response
  console.error('Error fetching ingredients:', result.statusText)
  return []
}

export async function handleGetIngredientsByProductId(
  productId: Product['id'],
) {
  try {
    if (!productId) {
      throw new Error('Product ID is required')
    }

    const result = await fetch(
      `http://localhost:3000/api/ingredient/getIngredientsByProductId?id=${productId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!result.ok) {
      throw new Error(`Failed to fetch ingredients: ${result.statusText}`)
    }

    const responseBody = await result.text()
    console.log('Response body:', responseBody)

    if (!responseBody.trim()) {
      throw new Error('Empty response body')
    }

    const data = JSON.parse(responseBody)
    console.log('Parsed data:', data)

    if (!data.ingredients) {
      throw new Error('Response does not contain ingredients')
    }

    return data.ingredients
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    throw error
  }
}
