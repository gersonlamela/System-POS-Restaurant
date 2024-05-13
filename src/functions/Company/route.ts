export async function handleGetCompany() {
  const result = await fetch('http://localhost:3000/api/company/getCompany', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (result.ok) {
    const data = await result.json()

    return data.company
  }

  // Handle non-ok response
  console.error('Error fetching Companies:', result.statusText)
  return []
}
