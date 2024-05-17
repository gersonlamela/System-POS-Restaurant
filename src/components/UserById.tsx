interface userIdProps {
  userId: string
}

export async function getUserById(userIdProps: userIdProps) {
  const { userId } = userIdProps

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getUserById`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    },
  )

  if (result.ok) {
    return result.json()
  }

  return []
}

export default async function UserById(userId: userIdProps) {
  const user = await getUserById(userId)

  return (
    <div className="flex w-full items-center justify-center text-2xl">
      <h1>{user.user.name}</h1>
    </div>
  )
}
