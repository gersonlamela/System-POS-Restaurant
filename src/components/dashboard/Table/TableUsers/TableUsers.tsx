'use client'
import { Button } from '@/components/ui/button'
import { User } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Users } from 'lucide-react'
import TablePagination from '../TablePagination'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import {
  getRole,
  getStatus,
  getStatusStyle,
  handleGetUsers,
} from '@/functions/user/user'
import AddUserModal from './AddUserModal'
import SeeUserModal from './SeeUserModal'
import { Trash } from '@phosphor-icons/react'
import EditUserModal from './EditUserModal'

interface UsersTableProps {
  users: User[]
}

export default function TableUsers({ users }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [Users, setUsers] = useState(users)

  // Calculate total pages based on TableCelle filtered users
  const filteredUsers = Users.filter(
    (Users) =>
      Users.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      Users.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Function to handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1) // Reset to TableCelle first page
  }

  async function handleDelete(id: string) {
    try {
      console.log('delete')
      // Faz uma solicitação DELETE para a rota apropriada, passando o ID do produto
      const response = await fetch(`/api/product/deleteProduct?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Verifica se a resposta é bem-sucedida
      if (response.ok) {
        const newUsers = await handleGetUsers()
        setUsers(newUsers)
        console.log('Produto eliminado com sucesso')
        // Faça qualquer outra manipulação de dados ou feedback visual necessário aqui
      } else {
        const data = await response.json()
        console.error('Erro ao deletar produto:', data.message)
        // Lida com erros ou exibe mensagens de erro para o usuário
      }
    } catch (error: any) {
      console.error('Erro ao deletar produto:', error.message)
      // Lida com erros de rede ou outros erros
    }
  }

  // Slice TableCelle filtered users array to only include users for TableCelle current page
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  return (
    <div className="w-full">
      <h1 className="mb-5 text-xl font-bold">Utilizadores</h1>
      <div className="mb-5 flex w-full items-center justify-between">
        <SearchInput
          searchPlaceholder="Pesquisar pelo Utilizador (id / nome)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <AddUserModal />
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full ">
          <TableHeader className="">
            <TableRow>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Name
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Email
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Telemóvel
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Morada
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Role
              </TableCell>
              <TableCell
                scope="col"
                className=" TableRowacking-wider text-center text-xs font-medium uppercase "
              >
                Status
              </TableCell>
              <TableCell
                scope="col"
                className=" TableRowacking-wider text-center text-xs font-medium uppercase "
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>
          <tbody className="">
            {currentUsers.length ? (
              currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                    {user.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                    {user.email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium ">
                    {user.phone}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium ">
                    {user.address}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                    {getRole(user.role)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4  text-sm ">
                    <div className="flex flex-row items-center  justify-center gap-2">
                      <div
                        className={` h-[10px] w-[10px] rounded-full ${getStatusStyle(user.status)}`}
                      />
                      {getStatus(user.status)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    <div className="flex flex-row items-center gap-2 ">
                      <SeeUserModal user={user} />
                      <div
                        className="rounded-lg bg-black px-2 py-2  text-white"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash size={16} weight="bold" />
                      </div>
                      <EditUserModal user={user} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm "
                >
                  Nenhum utilizador encontrado
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </Table>
      </div>
      <TablePagination
        type="Utilizadores"
        itemsPerPage={itemsPerPage}
        setItemsPerPage={handleItemsPerPageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        filteredItemsTotal={filteredUsers.length}
      />
    </div>
  )
}
