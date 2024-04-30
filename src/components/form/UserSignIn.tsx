// UserSignIn.jsx

'use client'
import { useState, useEffect } from 'react'
import { CardsUser } from '../ui/cardsUser'

import { User } from '@prisma/client'
import { handleGetUsers } from '@/functions/user/user'
import SignInForm from './SignInForm'
import { Power } from '@phosphor-icons/react'

export default function UserSignIn() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const userData = await handleGetUsers()
      setUsers(userData)
    }

    fetchUsers()
  }, [])

  const handleUserClick = (user?: User) => {
    if (user) {
      setSelectedUser(user)
    }
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
  }

  const handleClearSelectedUser = () => {
    setSelectedUser(null)
  }

  return (
    <div className="absolute inset-0 z-50  flex w-full flex-col items-center  justify-center backdrop-blur-sm">
      {selectedUser ? (
        <SignInForm
          user={selectedUser}
          handleClearSelectedUser={handleClearSelectedUser}
          handleCloseModal={handleCloseModal}
        />
      ) : (
        <div className="relative flex  h-[790px]  w-[750px]  flex-col items-center justify-between gap-10 rounded-[20px]  bg-white pb-12  pr-[35px] shadow-2xl  lg:w-[1100px]">
          <div className="mb-[46px] mt-[57px] flex w-full items-center justify-center text-[48px] font-bold text-third">
            POSLamela
          </div>
          <div className="flex h-full w-full flex-row items-center justify-center gap-[35px] pl-[100px]">
            <div className="flex h-full w-full flex-1 rounded-[30px]  bg-third p-[30px]">
              {users.length > 0 ? (
                <div className="grid w-full grid-cols-1  justify-items-center gap-[15px] lg:grid-cols-3 lg:justify-items-start">
                  {users.map((user: User, index: number) => (
                    <CardsUser
                      key={index}
                      user={user}
                      handleUserClick={handleUserClick}
                    />
                  ))}
                </div>
              ) : (
                <div> Não existe utilizadores </div>
              )}
            </div>

            <div className="flex h-full items-end">
              <Power
                weight="bold"
                size={28}
                className="font-bold text-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
