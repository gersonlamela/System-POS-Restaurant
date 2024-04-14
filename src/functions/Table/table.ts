import { Table } from '@prisma/client'

export async function handleGetTableById(tableId: Table['id']) {
  try {
    if (!tableId) {
      throw new Error('Table ID is required')
    }

    const result = await fetch(
      `http://localhost:3000/api/table/getTableById?id=${tableId}`,
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
    console.log('Response body:', responseBody)

    // Verifica se a resposta tem um corpo
    if (!responseBody.trim()) {
      throw new Error('Empty response body')
    }

    const data = JSON.parse(responseBody)
    console.log('Parsed data:', data)

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
