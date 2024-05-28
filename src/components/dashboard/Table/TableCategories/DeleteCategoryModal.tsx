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
import { ProductCategory } from '@prisma/client'

export function DeleteCategorieModal({ categoryId }: { categoryId: string }) {
  async function handleDelete(ingredientId: ProductCategory['id']) {
    try {
      const response = await fetch(
        `/api/category/deleteCategory?id=${ingredientId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        location.href = '/dashboard/categories'
      } else {
        const data = await response.json()
        console.error('Erro ao deletar categoria:', data.message)
      }
    } catch (error: any) {
      console.error('Erro ao deletar categoria:', error.message)
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[5px]  border border-third bg-white text-third shadow-button5">
          <Trash size={20} className="w-[20px]" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja eliminar o ingrediente?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(categoryId)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
