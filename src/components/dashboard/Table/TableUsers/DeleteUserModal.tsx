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
import { User } from '@prisma/client'

export function DeleteUserModal({ userId }: { userId: string }) {
  async function handleDelete(userId: User['id']) {
    try {
      console.log('delete')

      const response = await fetch(`/api/user/deleteUser?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        location.href = '/dashboard/users'
      } else {
        const data = await response.json()
        console.error('Erro ao deletar user:', data.message)
      }
    } catch (error: any) {
      console.error('Erro ao deletar user:', error.message)
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
          <AlertDialogTitle>Deseja eleminar o utilizador?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(userId)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
