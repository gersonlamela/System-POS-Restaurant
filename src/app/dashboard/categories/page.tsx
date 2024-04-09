import TableCategories from '@/components/dashboard/Table/TableCategories/TableCategories'
import { handleGetProductsCategory } from '@/functions/Product/product'

export default async function page() {
  const Categories = await handleGetProductsCategory()
  return (
    <div className="flex flex-1 justify-center overflow-auto p-10">
      <TableCategories Category={Categories} />
    </div>
  )
}
