import { User } from '@prisma/client'

export function getStatusStyle(status: User['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500 text-green-400 font-bold'
    case 'SUSPENDED':
      return 'bg-yellow-950 text-yellow-400 font-bold'
    case 'INACTIVE':
      return 'bg-red-950 text-red-400 font-bold'
  }
}

export function getStatus(status: User['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'Ativo'
    case 'SUSPENDED':
      return 'Suspenso'
    case 'INACTIVE':
      return 'Inativo'
  }
}
