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
import { MoreHorizontal } from 'lucide-react'
import TablePagination from '../TablePagination'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table'

interface UsersTableProps {
  users: User[]
}

export default function TableUsers({ users }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  // Calculate total pages based on TableCelle filtered users
  const filteredUsers = users.filter(
    (user) =>
      user.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
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

  // Slice TableCelle filtered users array to only include users for TableCelle current page
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  function getStatusStyle(status: User['status']) {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-950 text-green-400 font-bold'
      case 'SUSPENDED':
        return 'bg-yellow-950 text-yellow-400 font-bold'
      case 'INACTIVE':
        return 'bg-red-950 text-red-400 font-bold'
    }
  }
  return (
    <div>
      <SearchInput
        searchPlaceholder="Pesquisar pelo Utilizador"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Table className="w-[1200px] divide-y divide-gray-200 ">
        {/* Cabeçalhos da tabela */}
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableCell
              scope="col"
              className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
            >
              ID
            </TableCell>
            <TableCell
              scope="col"
              className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
            >
              Name
            </TableCell>
            <TableCell
              scope="col"
              className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
            >
              Email
            </TableCell>
            <TableCell
              scope="col"
              className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
            >
              Role
            </TableCell>
            <TableCell
              scope="col"
              className=" TableRowacking-wider text-center text-xs font-medium uppercase text-gray-500"
            >
              Status
            </TableCell>
            <TableCell
              scope="col"
              className=" TableRowacking-wider text-center text-xs font-medium uppercase text-gray-500"
            >
              Ações
            </TableCell>
          </TableRow>
        </TableHeader>
        <tbody className="divide-y divide-gray-200 bg-white">
          {currentUsers.length ? (
            currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {user.id}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.name}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.email}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.role}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                  <div
                    className={`rounded-xl px-2 py-1 ${getStatusStyle(user.status)}`}
                  >
                    {user.status}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem /* onClick={() => handleCopyUserId(user.id)} */
                      >
                        Copiar ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem /* onClick={() => handleViewUser(user.id)} */
                      >
                        Ver Utilizador
                      </DropdownMenuItem>
                      <DropdownMenuItem /* onClick={() => handleViewUser(user.id)} */
                      >
                        Editar Utilizador
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Nenhum utilizador encontrado
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
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
