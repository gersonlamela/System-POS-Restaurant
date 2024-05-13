import TableOrders from '@/components/dashboard/Table/TableOrders/TableOrders'
import { handleGetOrders } from '@/functions/Order/order'

export default async function page() {
  const orders = await handleGetOrders()

  return <TableOrders Order={orders} />
}
