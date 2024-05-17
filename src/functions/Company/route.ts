export async function handleGetCompany() {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/company/getCompany`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (result.ok) {
    const data = await result.json()

    return data.company
  }

  // Handle non-ok response
  console.error('Error fetching Companies:', result.statusText)
  return []
}
