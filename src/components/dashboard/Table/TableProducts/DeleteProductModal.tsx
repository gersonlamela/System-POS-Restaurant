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
    } catch (error: any) {
      console.error('Erro ao deletar produto:', error.message)
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <div className="rounded-lg bg-black px-2 py-2  text-white">
            <Trash size={16} weight="bold" />
          </div>
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
