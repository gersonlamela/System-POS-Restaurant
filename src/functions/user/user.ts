import { authOptions } from '@/lib/auth'
import { User } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/navigation'

export function getStatusStyle(status: User['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500 text-green-400 font-bold'
    case 'SUSPENDED':
      return 'bg-yellow-950 text-yellow-400 font-bold'
    case 'INACTIVE':
      return 'bg-red-950 text-red-400 font-bold'
  }
}

export function getStatus(status: User['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'Ativo'
    case 'SUSPENDED':
      return 'Suspenso'
    case 'INACTIVE':
      return 'Inativo'
  }
}

export function getRole(role: User['role']) {
  switch (role) {
    case 'ADMIN':
      return 'Admin'
    case 'EMPLOYEE':
      return 'Funcionário'
    case 'MANAGER':
      return 'Gestor'
  }
}

export async function handleGetUsers() {
  const result = await fetch('http://localhost:3000/api/user/getUsers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (result.ok) {
    const data = await result.json()

    // Ensure that data is an array, if not, return an empty array
    return data.user
  }

  // Handle non-ok response
  console.error('Error fetching users:', result.statusText)
  return []
}

export async function handleVerifyUserExist(userId: string) {
  if (!userId) {
    return false
  } else {
    const result = await fetch(
      `http://localhost:3000/api/user/verifyUserExist?id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (result.ok) {
      const data = await result.json()
      return data
    }
  }
}
