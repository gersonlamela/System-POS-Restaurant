import TableIngredients from '@/components/dashboard/Table/TableIngredients/TableIngredients'
import { handleGetIngredients } from '@/functions/Ingredients/ingredients'

export default async function page() {
  const ingredients = await handleGetIngredients()

  return <TableIngredients Ingredients={ingredients} />
}
