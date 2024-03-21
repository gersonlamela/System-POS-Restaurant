import TableUsers from '@/components/dashboard/Table/TableUsers/TableUsers'
import { handleGetUsers } from '@/functions/user/user'

export default async function page() {
  const users = await handleGetUsers()
  console.log(users)
  return (
    <div className="flex flex-1 justify-center overflow-auto p-10">
      <TableUsers users={users} />
    </div>
  )
}
