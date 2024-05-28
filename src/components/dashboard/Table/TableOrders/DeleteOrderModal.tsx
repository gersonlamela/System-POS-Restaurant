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
import { Trash } from '@phosphor-icons/react'
import { Order } from '@prisma/client'

// Type guard function
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error
}

export function DeleteOrderModal({ orderId }: { orderId: string }) {
  async function handleDelete(orderId: Order['id']) {
    try {
      console.log('delete')

      const response = await fetch(`/api/order/deleteOrder?id=${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        location.href = '/dashboard/orders'
      } else {
        const data = await response.json()
        console.error('Erro ao deletar pedido:', data.message)
      }
    } catch (error: unknown) {
      if (isErrorWithMessage(error)) {
        console.error('Erro ao deletar pedido:', error.message)
      } else {
        console.error('Erro ao deletar pedido:', error)
      }
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
          <AlertDialogTitle>Deseja eliminar o pedido?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(orderId)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
