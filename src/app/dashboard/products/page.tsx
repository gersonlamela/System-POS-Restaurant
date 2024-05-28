import { LineTitle } from '@/components/dashboard/LineTitle'
import TableProducts from '@/components/dashboard/Table/TableProducts/TableProducts'

import { handleGetProducts } from '@/functions/Product/product'

export default async function page() {
  const products = await handleGetProducts()

  return (
    <div className="flex w-full flex-col">
      <LineTitle title="Produtos" />

      <TableProducts Products={products} />
    </div>
  )
}
