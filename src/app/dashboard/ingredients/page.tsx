import TableIngredients from '@/components/dashboard/Table/TableIngredients/TableIngredients'
import { handleGetIngredients } from '@/functions/Ingredients/ingredients'

export default async function page() {
  const ingredients = await handleGetIngredients()

  return (
    <div className="flex flex-1 justify-center overflow-auto p-10">
      <TableIngredients Ingredients={ingredients} />
    </div>
  )
}
