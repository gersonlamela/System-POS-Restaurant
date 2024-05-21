import TableOrders from '@/components/dashboard/Table/TableOrders/TableOrders'
import { handleGetOrders } from '@/functions/Order/order'
import { Order } from '@/types/Order'

export async function getServerSideProps() {
  const orders = await handleGetOrders()

  return {
    props: {
      orders,
    },
  }
}

export default function Page({ orders }: { orders: Order[] }) {
  return <TableOrders orders={orders} />
}
