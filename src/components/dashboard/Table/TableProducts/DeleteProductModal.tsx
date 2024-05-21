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
import { Product } from '@prisma/client'

// Type guard function
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error
}

export function DeleteProductModal({ productId }: { productId: string }) {
  async function handleDelete(productId: Product['id']) {
    try {
      console.log('delete')

      const response = await fetch(
        `/api/product/deleteProduct?id=${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        location.href = '/dashboard/products'
      } else {
        const data = await response.json()
        console.error('Erro ao deletar produto:', data.message)
      }
    } catch (error: unknown) {
      if (isErrorWithMessage(error)) {
        console.error('Erro ao deletar produto:', error.message)
      } else {
        console.error('Erro ao deletar produto:', error)
      }
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
          <AlertDialogTitle>Deseja eliminar o produto?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(productId)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
