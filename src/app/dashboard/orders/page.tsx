import TableOrders from '@/components/dashboard/Table/TableOrders/TableOrders'
import { handleGetOrders } from '@/functions/Order/order'
import { Order } from '@/types/Order'

export default async function OrdersPage() {
  const orders: Order[] = await handleGetOrders()

  return <TableOrders orders={orders} />
}
