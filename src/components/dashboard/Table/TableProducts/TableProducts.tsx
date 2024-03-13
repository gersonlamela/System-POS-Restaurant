'use client'
import { Button } from '@/components/ui/button'
import { Product } from '@prisma/client'
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
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import AddProductModal from './AddProductModal'
import SeeProductModal from './SeeProductModal'
import {
  getCategory,
  getCategoryDirectory,
  getTax,
} from '@/functions/Product/product'
import Image from 'next/image'

interface ProductsTableProps {
  Products: Product[]
}

export default function TableProducts({ Products }: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  console.log(Products)
  // Calculate total pages based on the filtered Products
  const filteredProducts = Products.filter(
    (product) =>
      product.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  )

  return (
    <div className="w-full">
      <h1 className="mb-5 text-xl font-bold">Produtos</h1>
      <div className="mb-5 flex w-full items-center justify-between">
        <SearchInput
          searchPlaceholder="Pesquisar pelo Produto (id / nome)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <AddProductModal />
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full ">
          <TableHeader className="">
            <TableRow>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Imagem
              </TableCell>
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
                Price
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Desconto
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Categoria
              </TableCell>

              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Imposto
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
            {currentProducts.length ? (
              currentProducts.map((Product) => (
                <TableRow key={Product.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                    <img
                      src={`/uploads/${getCategoryDirectory(Product.category)}/${Product.image}`}
                      alt={Product.name}
                      width={50}
                      height={50}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                    {Product.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium ">
                    {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 1,
                    }).format(Product.price)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium ">
                    {Product.discount}%
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium ">
                    {getCategory(Product.category)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium ">
                    {getTax(Product.tax)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    <SeeProductModal Product={Product} />
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
          </tbody>
        </Table>
      </div>
      <TablePagination
        type="Produtos"
        itemsPerPage={itemsPerPage}
        setItemsPerPage={handleItemsPerPageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        filteredItemsTotal={filteredProducts.length}
      />
      {/* <div>
      <SearchInput
        searchPlaceholder={'Pesquisar pelo Produto'}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200">
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
      </div>
      <TablePagination
        type="Produtos"
        itemsPerPage={itemsPerPage}
        setItemsPerPage={handleItemsPerPageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        filteredItemsTotal={filteredProducts.length}
      />
    </div> */}
    </div>
  )
}
