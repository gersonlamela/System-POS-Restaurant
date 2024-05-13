import TableCategories from '@/components/dashboard/Table/TableCategories/TableCategories'
import { handleGetProductsCategory } from '@/functions/Product/product'

export default async function page() {
  const Categories = await handleGetProductsCategory()
  return <TableCategories Category={Categories} />
}
