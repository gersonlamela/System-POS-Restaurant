'use client'
import { Button } from '@/components/ui/button'
import { Products } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import TablePagination from '../TablePagination'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ProductsTableProps {
  Products: Products[]
}

export default function TableProducts({ Products }: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  console.log(Products)
  // Calculate total pages based on the filtered Products
  const filteredProducts = Products.filter(
    (user) =>
      user.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Function to handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1) // Reset to the first page
  }

  // Slice the filtered Products array to only include Products for the current page
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentProducts = filteredProducts.slice(
    indexOfFirstUser,
    indexOfLastUser,
  )

  return (
    <div>
      <SearchInput
        searchPlaceholder={'Pesquisar pelo Produto'}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Table className="w-[1200px] divide-y divide-gray-200 ">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableCell
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              ID
            </TableCell>
            <TableCell
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Imagem
            </TableCell>
            <TableCell
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Nome
            </TableCell>
            <TableCell
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Preço
            </TableCell>
            <TableCell
              scope="col"
              className=" text-center text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Ações
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 bg-white">
          {currentProducts.length ? (
            currentProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {product.id}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {product.image}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {product.name}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Intl.NumberFormat('pt-PT', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 1, // Garante que sempre haja pelo menos 1 dígito fracionário
                  }).format(product.price / 10)}
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
                      <DropdownMenuItem>Copiar ID</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Ver Utilizador</DropdownMenuItem>
                      <DropdownMenuItem>Editar Utilizador</DropdownMenuItem>
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
                Nenhum produto encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        type="Produtos"
        itemsPerPage={itemsPerPage}
        setItemsPerPage={handleItemsPerPageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        filteredItemsTotal={filteredProducts.length}
      />
    </div>
  )
}
