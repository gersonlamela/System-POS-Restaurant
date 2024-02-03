'use client'

import { useState } from 'react'
import { Button } from './button'
import { User } from '@prisma/client'
import SignInForm from '../form/SignInForm'

export function CardsUser({ user }: { user: User }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
  }

  return (
    <div>
      <Button
        onClick={() => handleUserClick(user)}
        className="flex h-[160px] w-[270px] items-center justify-center  rounded-[20px] bg-white"
      >
        <span className="text-xl font-semibold text-black">{user.name}</span>
      </Button>
      {selectedUser && (
        <SignInForm user={user} handleCloseModal={handleCloseModal} />
      )}
    </div>
  )
}
