import { User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

import { CardsUser } from '../ui/cardsUser'

export async function getUsers() {
  try {
    const result = await fetch('http://localhost:3000/api/user/getUsers', {
      method: 'GET',
    })

    if (result.ok) {
      return result.json()
    }
  } catch (error) {
    console.log(error)
  }

  return []
}

export async function UserSignIn() {
  const userData = await getUsers()

  const users = userData?.user || []

  return (
    <div className="absolute inset-0 z-50  flex w-full flex-col items-center  justify-center bg-[#FEF0E780]">
      <div className="px-25 flex  h-[790px] w-[1115px] flex-col items-center justify-between gap-10  rounded-[20px] bg-white pb-12 shadow-2xl">
        <Image
          src="/logo.png"
          width={229}
          height={159}
          alt="logo"
          className="mt-[21px]"
        />
        <div className="flex h-full w-[870px] flex-wrap  gap-3 rounded-[25px] bg-secondary p-7">
          {users ? (
            users.map((user: User, index: number) => (
              <CardsUser key={index} user={user} />
            ))
          ) : (
            <div> Não existe utilizadores </div>
          )}
          <Link
            href={`/pos/sign-up`}
            className="flex h-[160px] w-[270px] items-center justify-center  rounded-[20px] bg-white"
          >
            <span className="text-xl font-semibold text-black">+</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
