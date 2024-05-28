'use client'

import { ProductCategory } from '@prisma/client'

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

import { DeleteCategorieModal } from './DeleteCategoryModal'
import AddCategoryModal from './AddCategoryModal'
import SeeCategoryModal from './SeeCategoryModal'
import EditCategoryModal from './EditCategoryModal'

import { FilterIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCategoryIcon } from '@/functions/Category/category'

interface CategoryTableProps {
  Category: ProductCategory[] // Mark Categories prop as optional
}

export default function TableCategories({ Category }: CategoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = Category.filter(
    (Category) =>
      Category.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      Category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)

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
  const indexOfLastIngredient = currentPage * itemsPerPage
  const indexOfFirstIngredient = indexOfLastIngredient - itemsPerPage
  const currentCategories = filteredCategories.slice(
    indexOfFirstIngredient,
    indexOfLastIngredient,
  )

  return (
    <div className="mt-[65px] w-full">
      <div className="mb-[22px] flex w-full flex-wrap items-center justify-between gap-[15px]">
        <SearchInput
          searchPlaceholder="Pesquisar categoria (id / nome)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex flex-wrap items-center gap-[15px]">
          <div>
            <Button
              disabled
              className={`flex h-[40px] flex-row items-center gap-2 rounded-lg  border border-[#a9a9a9] bg-white px-[15px] text-[#a9a9a9]`}
            >
              <span className="text-base font-normal">
                Mostrar categoria c/ stock
              </span>
              <FilterIcon />
            </Button>
          </div>
          <div>
            <Button
              disabled
              className={`flex h-[40px] flex-row items-center gap-2 rounded-lg   border border-[#a9a9a9] bg-white px-[15px] text-[#a9a9a9]`}
            >
              <span className="text-base font-normal">
                Mostrar categoria s/ desconto (%)
              </span>
              <FilterIcon />
            </Button>
          </div>

          <div>
            <AddCategoryModal />
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
                Imagem
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-base font-normal uppercase text-third "
              >
                Name
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase text-[#B5B5B5] "
              >
                Preço
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase text-[#B5B5B5] "
              >
                Desconto
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase text-[#B5B5B5] "
              >
                Categoria
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase text-[#B5B5B5] "
              >
                Iva
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase text-[#B5B5B5] "
              >
                Stock
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
            {currentCategories?.length ? (
              currentCategories.map((Category) => (
                <TableRow key={Category.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal ">
                    <div className="mx-auto text-center">
                      {getCategoryIcon(Category.name)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base font-normal ">
                    {Category.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal text-[#B5B5B5]  ">
                    -
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal text-[#B5B5B5]  ">
                    -
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal text-[#B5B5B5]  ">
                    -
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal text-[#B5B5B5]  ">
                    -
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal text-[#B5B5B5]  ">
                    -
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4  text-base font-normal">
                    <div className="flex flex-row items-center justify-center gap-2 ">
                      <EditCategoryModal productCategory={Category} />
                      <SeeCategoryModal Category={Category} />
                      <DeleteCategorieModal categoryId={Category.id} />
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
        type="Categorias"
        itemsPerPage={itemsPerPage}
        setItemsPerPage={handleItemsPerPageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        filteredItemsTotal={filteredCategories.length}
      />
    </div>
  )
}
