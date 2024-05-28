/* eslint-disable prettier/prettier */
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
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FilterIcon } from 'lucide-react'

interface IngredientsTableProps {
  Ingredients?: Ingredient[] // Mark Ingredients prop as optional
}

export default function TableIngredients({
  Ingredients = [],
}: IngredientsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false)

  const filterIngredientsInStock = () => {
    setShowOnlyInStock(!showOnlyInStock)
  }

  const filterIngredientsInDiscounted = () => {
    setShowOnlyDiscounted(!showOnlyDiscounted)
  }

  const filteredIngredients = Ingredients
    ? Ingredients.filter((ingredient) => {
      const stock = ingredient.stock ?? 0 // Usa 0 como valor padrão se ingredient.stock for null

      // Função para remover caracteres especiais de uma string
      const removeSpecialChars = (str: string) => str.replace(/[^\w\s]/g, '')

      // Convertendo a string de pesquisa e o nome do ingrediente para minúsculas e removendo caracteres especiais
      const searchTermCleaned = removeSpecialChars(
        searchTerm.toLowerCase().trim(),
      )
      const ingredientNameCleaned = removeSpecialChars(
        ingredient.name.toLowerCase(),
      )

      if (showOnlyInStock && stock === 0) return false
      if (searchTermCleaned === '') return true // Se o termo de pesquisa estiver vazio, inclui todos os ingredientes

      // Realizando a comparação entre a string de pesquisa e o nome do ingrediente
      return (
        ingredient.id.toString().includes(searchTermCleaned) ||
        ingredientNameCleaned.includes(searchTermCleaned)
      )
    })
    : []

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
    <div className="w-full mt-[65px]">
      <div className="mb-[22px] flex-wrap flex w-full gap-[15px] items-center justify-between">
        <SearchInput
          searchPlaceholder="Pesquisar ingrediente (id / nome)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex gap-[15px] items-center flex-wrap">
          <div>
            <Button
              onClick={filterIngredientsInStock}
              className={`flex h-[40px] flex-row items-center gap-2 rounded-lg  px-[15px] ${showOnlyInStock ? 'bg-white text-secondary border border-secondary' : 'bg-white text-[#a9a9a9] border border-[#a9a9a9]'}`}>
              <span className='font-normal text-base'>{showOnlyInStock ? 'Mostrar ingredientes c/ stock' : 'Mostrar ingredientes s/ stock'}</span>
              <FilterIcon />
            </Button>
          </div>
          <div> <Button
            onClick={filterIngredientsInDiscounted}
            className={`flex h-[40px] flex-row items-center gap-2 rounded-lg   px-[15px] ${showOnlyDiscounted ? 'bg-white text-secondary border border-secondary ' : 'bg-white text-[#a9a9a9] border border-[#a9a9a9]'}`}>
            <span className='font-normal text-base'>     {showOnlyDiscounted ? 'Mostrar ingredientes s/ desconto (%)' : 'Mostrar ingredientes c/ desconto (%)'}</span>
            <FilterIcon />
          </Button></div>

          <div>
            <AddIngredientModal />
          </div>
        </div>

      </div>


      <div className="h-[560px] overflow-x-auto">
        <Table className="min-w-full ">
          <TableHeader className="">
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
          <tbody className="">
            {currentIngredients?.length ? (
              currentIngredients.map((Ingredient) => (
                <TableRow key={Ingredient.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base font-normal ">
                    <Image
                      src={`/uploads/ingredients/${Ingredient.image}`}
                      alt={Ingredient.name}
                      width={60}
                      height={60}
                      className="h-[60px] w-[60px] object-fill mx-auto rounded-[5px] "
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base font-normal ">
                    {Ingredient.name}
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
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal text-third  ">
                    {Ingredient.stock}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4  text-base font-normal">
                    <div className="flex flex-row items-center justify-center gap-2 ">
                      <EditIngredientModal ingredient={Ingredient} />
                      <SeeIngredientModal Ingredient={Ingredient} />
                      <DeleteIngredientModal ingredientId={Ingredient.id} />
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
