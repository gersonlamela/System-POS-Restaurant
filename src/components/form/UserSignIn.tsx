import { User } from '@prisma/client'
import Link from 'next/link'

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
  const user = await getUsers()

  return (
    <div className="absolute flex h-full w-full flex-col items-center justify-center bg-[#FEF0E780]">
      <div className="px-25 flex h-[790px] w-[1115px] flex-col items-center justify-between gap-10  rounded-[40px] bg-white pb-12 shadow-lg">
        <h1 className="text-9xl font-semibold">Logo</h1>
        <div className="flex h-full w-[870px] flex-wrap  gap-4 rounded-[25px] bg-primary p-7">
          {user.user.map((user: User, index: any) => (
            <Link
              key={index}
              href={`/sign-in/${user.id}`}
              className="flex h-[160px] w-[270px] items-center justify-center  rounded-[20px] bg-white"
            >
              <span className="text-xl font-semibold text-black">
                {user.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
