'use client'
import { User } from '@prisma/client'
import TablePagination from '../TablePagination'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getRole, getStatus, getStatusStyle } from '@/functions/user/user'
import AddUserModal from './AddUserModal'
import SeeUserModal from './SeeUserModal'

import EditUserModal from './EditUserModal'
import { DeleteUserModal } from './DeleteUserModal'
import { Button } from '@/components/ui/button'
import { FilterIcon } from 'lucide-react'

interface UsersTableProps {
  users: User[]
}

export default function TableUsers({ users }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [searchTerm, setSearchTerm] = useState('')
  const [Users] = useState(users)

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

  // Slice TableCelle filtered users array to only include users for TableCelle current page
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  return (
    <div className="mt-[65px] w-full">
      <div className="mb-[22px] flex w-full flex-wrap items-center justify-between gap-[15px]">
        <SearchInput
          searchPlaceholder="Pesquisar utilizador (id / nome)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex flex-wrap items-center gap-[15px]">
          <div>
            <Button
              disabled
              className={`flex h-[40px] flex-row items-center gap-2  rounded-lg  border border-[#a9a9a9] bg-white px-[15px] text-[#a9a9a9]`}
            >
              <span className="text-base font-normal">
                Mostrar utilizadores c/ stock
              </span>
              <FilterIcon />
            </Button>
          </div>
          <div>
            <Button
              disabled
              className={`flex h-[40px] flex-row items-center  gap-2 rounded-lg   border border-[#a9a9a9] bg-white px-[15px] text-[#a9a9a9]`}
            >
              <span className="text-base font-normal">
                Mostrar utilizadores s/ desconto (%)
              </span>
              <FilterIcon />
            </Button>
          </div>

          <div>
            <AddUserModal />
          </div>
        </div>
      </div>

      <div className="h-[560px] overflow-x-auto">
        <Table className="min-w-full ">
          <TableHeader className="sticky top-0">
            <TableRow>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase text-third "
              >
                Nome
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-base font-normal uppercase text-third "
              >
                Email
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase  text-third "
              >
                Telemovel
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase  text-third "
              >
                Morada
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase  text-third "
              >
                Cargo
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase  text-third "
              >
                Status
              </TableCell>
              <TableCell
                scope="col"
                className=" TableRowacking-wider text-center text-base font-normal uppercase text-third  "
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {currentUsers?.length ? (
              currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal text-third">
                    {user.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base font-normal  text-third">
                    {user.email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal  text-third  ">
                    {user.phone}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal  text-third  ">
                    {user.address}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal  text-third  ">
                    {getRole(user.role)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal text-third  ">
                    <div className="flex flex-row items-center  justify-center gap-2">
                      <div
                        className={` h-[10px] w-[10px] rounded-full ${getStatusStyle(user.status)}`}
                      />
                      {getStatus(user.status)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4  text-base font-normal">
                    <div className="flex flex-row items-center justify-center gap-2 ">
                      <EditUserModal user={user} />
                      <SeeUserModal user={user} />
                      <DeleteUserModal userId={user.id} />
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
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
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
