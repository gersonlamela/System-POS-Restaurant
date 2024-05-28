/* eslint-disable prettier/prettier */
'use client'

import TablePagination from '../TablePagination'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table'

import AddProductModal from './AddProductModal'
import SeeProductModal from './SeeProductModal'
import { getTax } from '@/functions/Product/product'

import EditProductModal from './EditProduct'

import { Button } from '@/components/ui/button'
import { FilterIcon } from 'lucide-react'
import { ProductWithIngredients } from '@/types/Product'
import { DeleteProductModal } from './DeleteProductModal'
import Image from 'next/image'

// Defina a interface para representar os produtos com ingredientes
export interface Products {
  Products: ProductWithIngredients[] // Use a interface Product em ProductWithIngredients
}

export default function TableProducts({ Products }: Products) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8) // Always set items per page to 8
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false)

  const filterProductsInStock = () => {
    setShowOnlyInStock(!showOnlyInStock)
  }

  const filterProductsDiscounted = () => {
    setShowOnlyDiscounted(!showOnlyDiscounted)
  }

  const filteredProducts = Products
    ? Products.filter((product) => {
      const stock = product.stock ?? 0 // Usa 0 como valor padrão se product.stock for null
      const discount = product.discount ?? 0 // Usa 0 como valor padrão se product.discount for null

      // Função para remover caracteres especiais de uma string
      const removeSpecialChars = (str: string) => str.replace(/[^\w\s]/g, '')

      // Convertendo a string de pesquisa e o nome do produto para minúsculas e removendo caracteres especiais
      const searchTermCleaned = removeSpecialChars(
        searchTerm.toLowerCase().trim(),
      )
      const productNameCleaned = removeSpecialChars(
        product.name.toLowerCase(),
      )

      if (showOnlyInStock && stock !== 0) return false
      if (showOnlyDiscounted && discount <= 0) return false
      if (searchTermCleaned === '') return true // Se o termo de pesquisa estiver vazio, inclui todos os produtos

      // Realizando a comparação entre a string de pesquisa e o nome do produto
      return (
        product.id.toString().includes(searchTermCleaned) ||
        productNameCleaned.includes(searchTermCleaned)
      )
    })
    : []

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
    <div className="w-full mt-[65px]">
      <div className="mb-[22px] flex-wrap flex w-full gap-[15px] items-center justify-between">
        <SearchInput
          searchPlaceholder="Pesquisar produto (id / nome)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex gap-[15px] items-center flex-wrap">
          <div>
            <Button
              onClick={filterProductsInStock}
              className={`flex h-[40px] flex-row items-center gap-2 rounded-lg  px-[15px] ${showOnlyInStock ? 'bg-white text-secondary border border-secondary' : 'bg-white text-[#a9a9a9] border border-[#a9a9a9]'}`}>
              <span className='font-normal text-base'>{showOnlyInStock ? 'Mostrar produtos c/ stock' : 'Mostrar produtos s/ stock'}</span>
              <FilterIcon />
            </Button>
          </div>
          <div> <Button
            onClick={filterProductsDiscounted}
            className={`flex h-[40px] flex-row items-center gap-2 rounded-lg   px-[15px] ${showOnlyDiscounted ? 'bg-white text-secondary border border-secondary ' : 'bg-white text-[#a9a9a9] border border-[#a9a9a9]'}`}>
            <span className='font-normal text-base'>     {showOnlyDiscounted ? 'Mostrar produtos s/ desconto (%)' : 'Mostrar produtos c/ desconto (%)'}</span>
            <FilterIcon />
          </Button></div>

          <div>
            <AddProductModal />
          </div>
        </div>

      </div>

      <div className="h-[560px] overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="">
            <TableRow>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-third text-base font-normal uppercase "
              >
                Imagem
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-third text-base font-normal uppercase "
              >
                Nome
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-right text-third text-base font-normal uppercase "
              >
                Preço
              </TableCell>

              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-third text-base font-normal uppercase "
              >
                Desconto
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-third text-base font-normal uppercase "
              >
                Categoria
              </TableCell>

              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-third text-base font-normal uppercase "
              >
                Iva
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-third text-base font-normal uppercase "
              >
                Stock
              </TableCell>

              <TableCell
                scope="col"
                className=" TableRowacking-wider text-center text-third text-base font-normal uppercase "
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>
          <tbody className="">
            {currentProducts.length ? (
              currentProducts.map((Product) => (
                <TableRow key={Product.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base ">
                    <Image
                      src={`/uploads/products/${Product.image}`}
                      alt={Product.name}
                      width={60}
                      height={60}
                      className="h-[60px] w-[60px] object-fill mx-auto rounded-[5px] "
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base  text-left">
                    {Product.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base font-normal text-right ">
                    {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 1,
                    }).format(Product.price)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base font-normal text-center ">
                    {Product.discount}%
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base font-normal text-left ">
                    {Product.ProductCategory.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base font-normal text-center ">
                    {getTax(Product.tax)}%
                  </TableCell>
                  <TableCell className={`whitespace-nowrap px-6 py-4 text-base font-normal text-center ${Product.stock ? 'text-black' : 'text-[#a9a9a9]'}`}>
                    {Product.stock ? Product.stock : '-'}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal center">
                    <div className="flex flex-row items-center gap-2 justify-center ">
                      <EditProductModal Product={Product} />
                      <SeeProductModal Product={Product} />
                      <DeleteProductModal productId={Product.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
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
    </div>
  )
}
