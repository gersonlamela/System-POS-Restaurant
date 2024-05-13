import TableProducts from '@/components/dashboard/Table/TableProducts/TableProducts'

import { handleGetProducts } from '@/functions/Product/product'

export default async function page() {
  const products = await handleGetProducts()

  return <TableProducts Products={products} />
}
