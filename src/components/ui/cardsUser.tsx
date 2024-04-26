'use client'

// CardsUser.jsx
import { Button } from './button'
import { User } from '@prisma/client'

interface CardsUserProps {
  user: User
  handleUserClick: (user: User) => void
}

export function CardsUser({ user, handleUserClick }: CardsUserProps) {
  return (
    <div>
      <Button
        onClick={() => handleUserClick(user)}
        className="flex h-[150px] w-[270px] items-center justify-center  rounded-[25px] bg-white text-primary"
      >
        <span className="text-xl font-semibold text-primary">{user.name}</span>
      </Button>
    </div>
  )
}
