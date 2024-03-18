import TableProducts from '@/components/dashboard/Table/TableProducts/TableProducts'
import { handleGetProducts } from '@/functions/Product/product'

export default async function page() {
  const products = await handleGetProducts()

  return (
    <div className="flex flex-1 justify-center overflow-auto p-10">
      <TableProducts Products={products} />
    </div>
  )
}
