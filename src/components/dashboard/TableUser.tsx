'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { User } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal } from 'lucide-react'

interface TableUsersProps {
  users: User[]
}

export function TableUsers({ users }: TableUsersProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter((user) => {
    const searchTermLowerCase = searchTerm.toLowerCase()
    return (
      user.id.toString().includes(searchTermLowerCase) ||
      user.name.toLowerCase().includes(searchTermLowerCase)
    )
  })

  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string | null) => {
    if (value !== null) {
      const newItemsPerPage = parseInt(value, 10)
      setItemsPerPage(newItemsPerPage)
      setCurrentPage(1)
    }
  }

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    setCurrentPage(1)
  }

  return (
    <div className="w-full">
      {/* Select para o número de itens por página */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-sm">
            Itens por Página:
          </label>
          <Select
            defaultValue={itemsPerPage.toString()}
            onValueChange={(value) => handleItemsPerPageChange(value)}
          >
            <SelectTrigger className="w-[60px]">
              <SelectValue placeholder="Produtos por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="searchTerm" className="text-sm">
            Pesquisar:{' '}
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder="ID / NOME"
          />
        </div>
      </div>

      <Table className="table-auto divide-gray-200">
        <TableCaption>A list of your users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableCell className="w-[100px] lg:w-[150px]">ID</TableCell>
            <TableCell className="lg:w-[200px]">Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell className="hidden lg:table-cell">Address</TableCell>
            <TableCell className="hidden lg:table-cell">Phone</TableCell>
            <TableCell className="hidden lg:table-cell">Role</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell>Company ID</TableCell>
            <TableCell>Orders ID</TableCell>
            <TableCell className="w-[100px] lg:w-[120px]">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell
                className="max-w-[150px] cursor-pointer overflow-hidden overflow-ellipsis font-medium"
                title={user.id}
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                {user.id}
              </TableCell>
              <TableCell className="overflow-hidden overflow-ellipsis lg:w-[200px]">
                {user.name}
              </TableCell>
              <TableCell className="overflow-hidden overflow-ellipsis">
                {user.email}
              </TableCell>
              <TableCell className="hidden overflow-hidden overflow-ellipsis lg:table-cell">
                {user.address}
              </TableCell>
              <TableCell className="hidden overflow-hidden overflow-ellipsis lg:table-cell">
                {user.phone}
              </TableCell>
              <TableCell className="hidden overflow-hidden overflow-ellipsis lg:table-cell">
                {user.role}
              </TableCell>
              <TableCell>
                {format(new Date(user.createdAt), 'dd-MM-yyyy HH:mm:ss')}
              </TableCell>
              <TableCell>
                {format(new Date(user.updatedAt), 'dd-MM-yyyy HH:mm:ss')}
              </TableCell>
              <TableCell className="max-w-[150px] overflow-hidden overflow-ellipsis ">
                {user.companyId}
              </TableCell>
              <TableCell className="max-w-[150px] overflow-hidden overflow-ellipsis ">
                {user.ordersId}
              </TableCell>
              <TableCell className="w-[100px] lg:w-[120px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open Menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(user.id)}
                    >
                      Copy User ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View customer</DropdownMenuItem>
                    <DropdownMenuItem>View payment details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {currentUsers.length === 0 && (
            <TableRow>
              <TableCell colSpan={12} align="center">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={12}>Total Users</TableCell>
            <TableCell className="text-right">{currentUsers.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Pagination component */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => handlePageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
