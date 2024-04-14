'use client'

import { ProductCategory } from '@prisma/client'

import TablePagination from '../TablePagination'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table'

import { DeleteCategorieModal } from './DeleteCategoryModal'
import AddCategoryModal from './AddCategoryModal'
import SeeCategoryModal from './SeeCategoryModal'
import EditCategoryModal from './EditCategoryModal'
import {
  BeerBottle,
  CookingPot,
  ForkKnife,
  Hamburger,
} from '@phosphor-icons/react'
import BowlSteam from '../../../../../public/icons/Bowl'
import { IceCream } from 'lucide-react'

interface CategoryTableProps {
  Category: ProductCategory[] // Mark Categories prop as optional
}

export default function TableCategories({ Category }: CategoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Entradas':
        return <ForkKnife size={32} />
      case 'Sopas':
        return <CookingPot size={32} />
      case 'Hamburguers':
        return <Hamburger size={32} />
      case 'Acompanhamentos':
        return <BowlSteam />
      case 'Bebidas':
        return <BeerBottle size={32} />
      case 'Sobremesas':
        return <IceCream size={32} />
      // Adicione mais cases conforme necessário para outras categorias
      default:
        return null // Retorna null se o nome da categoria não corresponder
    }
  }

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

  async function handleDelete(id: string) {
    try {
      console.log('delete')

      const response = await fetch(`/api/product/deleteCategory?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Verifica se a resposta é bem-sucedida
      if (response.ok) {
        console.log('Categoria eliminado com sucesso')
      } else {
        const data = await response.json()
        console.error('Erro ao deletar categoria:', data.message)
      }
    } catch (error: any) {
      console.error('Erro ao deletar categoria:', error.message)
    }
  }

  return (
    <div className="w-full">
      <h1 className="mb-5 text-xl font-bold">Categories</h1>
      <div className="mb-5 flex w-full items-center justify-between">
        <SearchInput
          searchPlaceholder="Pesquisar pela categoria (id / nome)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <AddCategoryModal />
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
                Nome
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
            {currentCategories?.length ? (
              currentCategories.map((Category) => (
                <TableRow key={Category.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                    {getCategoryIcon(Category.name)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                    {Category.name}
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-6 py-4  text-sm font-medium">
                    <div className="flex flex-row items-center justify-center gap-2 ">
                      <SeeCategoryModal Category={Category} />
                      <DeleteCategorieModal categoryId={Category.id} />
                      <EditCategoryModal productCategory={Category} />
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
