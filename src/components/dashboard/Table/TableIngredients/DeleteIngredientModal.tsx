import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash } from '@phosphor-icons/react'
import { Ingredient } from '@prisma/client'

export function DeleteIngredientModal({
  ingredientId,
}: {
  ingredientId: string
}) {
  async function handleDelete(ingredientId: Ingredient['id']) {
    try {
      const response = await fetch(
        `/api/ingredient/deleteIngredient?id=${ingredientId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        location.href = '/dashboard/ingredients'
      } else {
        const data = await response.json()
        console.error('Erro ao deletar ingrediente:', data.message)
      }
    } catch (error: any) {
      console.error('Erro ao deletar ingrediente:', error.message)
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={'icon'} className="bg-black">
          <Trash size={16} weight="bold" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja eliminar o ingrediente?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(ingredientId)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
