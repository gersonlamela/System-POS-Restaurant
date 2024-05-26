'use client'

import { Ingredient } from '@prisma/client'

import TablePagination from '../TablePagination'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table'

import EditIngredientModal from './EditIngredientModal'

import AddIngredientModal from './AddIngreditentModal'
import { DeleteIngredientModal } from './DeleteIngredientModal'
import SeeIngredientModal from './SeeIngredientModal'

interface IngredientsTableProps {
  Ingredients?: Ingredient[] // Mark Ingredients prop as optional
}

export default function TableIngredients({
  Ingredients = [],
}: IngredientsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [searchTerm, setSearchTerm] = useState('')
  const [ingredients] = useState(Ingredients)

  const filteredIngredients = ingredients.filter(
    (Ingredient) =>
      Ingredient.id
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      Ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage)

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
  const currentIngredients = filteredIngredients.slice(
    indexOfFirstIngredient,
    indexOfLastIngredient,
  )

  return (
    <div className="w-full">
      <h1 className="mb-5 text-xl font-bold">Ingredientes</h1>
      <div className="mb-5 flex w-full items-center justify-between">
        <SearchInput
          searchPlaceholder="Pesquisar pelo Ingrediente (id / nome)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <AddIngredientModal />
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
                className=" TableRowacking-wider text-center text-xs font-medium uppercase  "
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>
          <tbody className="">
            {currentIngredients?.length ? (
              currentIngredients.map((Ingredient) => (
                <TableRow key={Ingredient.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                    <img
                      src={`/uploads/ingredients/${Ingredient.image}`}
                      alt={Ingredient.name}
                      width={70}
                      height={70}
                      className="h-[70px] w-[70px] object-contain"
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                    {Ingredient.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium ">
                    {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 1,
                    }).format(Ingredient.price)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-6 py-4  text-sm font-medium">
                    <div className="flex flex-row items-center justify-center gap-2 ">
                      <SeeIngredientModal Ingredient={Ingredient} />

                      <DeleteIngredientModal ingredientId={Ingredient.id} />
                      <EditIngredientModal ingredient={Ingredient} />
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
          </tbody>
        </Table>
      </div>
      <TablePagination
        type="Ingredientes"
        itemsPerPage={itemsPerPage}
        setItemsPerPage={handleItemsPerPageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        filteredItemsTotal={filteredIngredients.length}
      />
    </div>
  )
}
