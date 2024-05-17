import { Table } from '@prisma/client'

export async function handleGetTableById(tableId: Table['id']) {
  try {
    if (!tableId) {
      throw new Error('Table ID is required')
    }

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/table/getTableById?id=${tableId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!result.ok) {
      throw new Error(`Failed to fetch tables: ${result.statusText}`)
    }

    const responseBody = await result.text()

    // Verifica se a resposta tem um corpo
    if (!responseBody.trim()) {
      throw new Error('Empty response body')
    }

    const data = JSON.parse(responseBody)

    // Verifica se a resposta contém a chave 'products'
    if (!data.table) {
      throw new Error('Response does not contain tables')
    }

    return data.table
  } catch (error) {
    console.error('Error fetching tables:', error)
    // Retorne uma lista vazia ou lance o erro para tratamento externo
    throw error
  }
}

export async function handleGetTables() {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/table/getTables`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (result.ok) {
    const data = await result.json()

    return data.table
  }

  // Handle non-ok response
  console.error('Error fetching tables:', result.statusText)
  return []
}
