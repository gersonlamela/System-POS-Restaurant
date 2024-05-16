import { handleGetOrders } from '@/functions/Order/order'
import { handleGetUsers } from '@/functions/user/user'
import { ForkKnife, Users } from '@phosphor-icons/react'

import { useEffect, useState } from 'react'

export default function UsersCard() {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await handleGetUsers()
        const fetechOrders = await handleGetOrders()
        setOrders(fetechOrders)
        setUsers(fetchedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="mb-4 flex flex-col items-center justify-start gap-[15px] md:flex-row ">
      <div className="flex h-[80px] w-[200px] flex-row items-center justify-center gap-[15px] rounded-[10px]  border-2 bg-white p-[10px] shadow-button10">
        <Users size={24} /> Utilizadors = {users.length}
      </div>
      <div className="flex h-[80px] w-[200px] items-center justify-center gap-[15px] rounded-[10px] border-2 bg-white p-[10px] shadow-button10">
        <ForkKnife size={24} /> Pedidos = {orders.length}
      </div>
    </div>
  )
}
