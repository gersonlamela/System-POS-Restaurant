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
import { Products } from '@prisma/client'
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

interface TableProductsProps {
  products: Products[]
}

export function TableProducts({ products }: TableProductsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter((product) => {
    const searchTermLowerCase = searchTerm.toLowerCase()
    return (
      product.id.toString().includes(searchTermLowerCase) ||
      product.name.toLowerCase().includes(searchTermLowerCase) ||
      (product.ordersId !== null &&
        product.ordersId.toString().includes(searchTermLowerCase))
    )
  })

  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

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
            Itens por Página:{' '}
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

      <Table className="">
        <TableCaption>A list of your products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableCell className="w-[100px]">ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Tax</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell>Orders Id</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell
                className="font-medium"
                onClick={() => navigator.clipboard.writeText(product.id)}
              >
                {product.id}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">{product.price}</TableCell>
              <TableCell>{product.image}</TableCell>
              <TableCell>{product.tax}</TableCell>
              <TableCell>{product.discount}</TableCell>
              <TableCell>
                {format(new Date(product.createdAt), 'dd-MM-yyyy HH:mm:ss')}
              </TableCell>
              <TableCell>
                {format(new Date(product.updatedAt), 'dd-MM-yyyy HH:mm:ss')}
              </TableCell>
              <TableCell>{product.ordersId}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir Menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(product.id)}
                    >
                      Copiar ID do produto
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View customer</DropdownMenuItem>
                    <DropdownMenuItem>View payment details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {currentProducts.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} align="center">
                Nenhum produto encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={9}>Total Produtos</TableCell>
            <TableCell className="text-right">
              {currentProducts.length}
            </TableCell>
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
