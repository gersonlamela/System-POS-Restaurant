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
