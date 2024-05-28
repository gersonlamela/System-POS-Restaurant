import { LineTitle } from '@/components/dashboard/LineTitle'
import TableUsers from '@/components/dashboard/Table/TableUsers/TableUsers'
import { handleGetUsers } from '@/functions/user/user'

export default async function page() {
  const users = await handleGetUsers()
  console.log(users)
  return (
    <div className="flex w-full flex-col">
      <LineTitle title="Utilizadores" />

      <TableUsers users={users} />
    </div>
  )
}
