import { LineTitle } from '@/components/dashboard/LineTitle'
import TableCategories from '@/components/dashboard/Table/TableCategories/TableCategories'
import { handleGetProductsCategory } from '@/functions/Product/product'

export default async function page() {
  const Categories = await handleGetProductsCategory()
  return (
    <div className="flex w-full flex-col">
      <LineTitle title="Categorias" />
      <TableCategories Category={Categories} />
    </div>
  )
}
