import TableOrders from '@/components/dashboard/Table/TableOrders/TableOrders'
import { handleGetOrders } from '@/functions/Order/order'
import { Order } from '@/types/Order'

// Marcar o componente como um Server Component explicitamente (opcional)
export const dynamic = 'force-dynamic'

export default async function Page() {
  const orders: Order[] = await handleGetOrders()

  console.log('orders', orders)

  return <TableOrders orders={orders} />
}
