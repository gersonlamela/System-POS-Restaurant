import { TableUsers } from '@/components/dashboard/TableUser'

export async function getUsers() {
  try {
    const result = await fetch('http://localhost:3000/api/user/getUsers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (result.ok) {
      const data = await result.json()
      // Ensure that data is an array, if not, return an empty array
      return Array.isArray(data.user) ? data.user : []
    }

    // Handle non-ok response
    console.error('Error fetching users:', result.statusText)
    return []
  } catch (error: any) {
    // Handle any other errors that may occur during the fetch
    console.error('Error fetching users:', error.message)
    return []
  }
}

export default async function page() {
  const users = await getUsers()
  return (
    <div className="flex flex-1 items-center justify-center overflow-auto p-2 md:p-20">
      <TableUsers users={users} />
    </div>
  )
}
