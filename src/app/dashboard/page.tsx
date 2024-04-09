'use client'

import React, { useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'
import { handleGetUsers } from '@/functions/user/user'
import { User } from '.prisma/client'

export default function Dashboard() {
  const [userData, setUserData] = useState<User[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users: User[] = await handleGetUsers()

        setUserData(users)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <h1>
      {userData.map((user) => (
        <h1 key={user.id}>{user.name}</h1>
      ))}
    </h1>
  )
}
