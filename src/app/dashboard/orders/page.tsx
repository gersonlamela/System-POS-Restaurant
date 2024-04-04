import TableOrders from '@/components/dashboard/Table/TableOrders/TableOrders'
import { handleGetOrders } from '@/functions/Order/order'
import { handleGetUsers } from '@/functions/user/user'

export default async function page() {
  const orders = await handleGetOrders()

  return (
    <div className="flex flex-1 justify-center overflow-auto p-10">
      <TableOrders Order={orders} />
    </div>
  )
}
