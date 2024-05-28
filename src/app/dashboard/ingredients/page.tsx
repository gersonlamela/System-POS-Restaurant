import { LineTitle } from '@/components/dashboard/LineTitle'
import TableIngredients from '@/components/dashboard/Table/TableIngredients/TableIngredients'
import { handleGetIngredients } from '@/functions/Ingredients/ingredients'

export default async function page() {
  const ingredients = await handleGetIngredients()

  return (
    <div className="flex w-full flex-col">
      <LineTitle title="Ingredientes" />

      <TableIngredients Ingredients={ingredients} />
    </div>
  )
}
