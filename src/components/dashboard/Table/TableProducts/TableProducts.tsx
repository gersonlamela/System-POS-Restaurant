'use client'

import { Ingredient, Product as PrismaProduct } from '@prisma/client'

import TablePagination from '../TablePagination'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table'

import AddProductModal from './AddProductModal'
import SeeProductModal from './SeeProductModal'
import {
  getCategory,
  getCategoryDirectory,
  getTax,
  handleGetProducts,
} from '@/functions/Product/product'

import EditProductModal from './EditProduct'
import { DeleteProductModal } from './DeleteProductModal'
import { Button } from '@/components/ui/button'
import { FilterIcon } from 'lucide-react'

// Defina uma interface para representar um produto
interface Product extends PrismaProduct {
  ingredients: Ingredient[] // Adicione a propriedade 'ingredients' que é um array de Ingredient
}

// Defina a interface para representar os produtos com ingredientes
export interface ProductWithIngredients {
  Products: Product[] // Use a interface Product em ProductWithIngredients
}

export default function TableProducts({ Products }: ProductWithIngredients) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState(Products)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)

  const filterProductsInStock = () => {
    setShowOnlyInStock(!showOnlyInStock)
  }

  const filteredProducts = Products
    ? Products.filter((product) => {
        const stock = product.stock ?? 0 // Usa 0 como valor padrão se product.stock for null

        // Função para remover caracteres especiais de uma string
        const removeSpecialChars = (str: any) => str.replace(/[^\w\s]/g, '')

        // Convertendo a string de pesquisa e o nome do produto para minúsculas e removendo caracteres especiais
        const searchTermCleaned = removeSpecialChars(
          searchTerm.toLowerCase().trim(),
        )
        const productNameCleaned = removeSpecialChars(
          product.name.toLowerCase(),
        )

        if (showOnlyInStock && stock !== 0) return false
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

  async function handleDelete(id: string) {
    try {
      console.log('delete')
      // Faz uma solicitação DELETE para a rota apropriada, passando o ID do produto
      const response = await fetch(`/api/product/deleteProduct?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Verifica se a resposta é bem-sucedida
      if (response.ok) {
        const newProducts = await handleGetProducts()
        setProducts(newProducts)
        console.log('Produto eliminado com sucesso')
        // Faça qualquer outra manipulação de dados ou feedback visual necessário aqui
      } else {
        const data = await response.json()
        console.error('Erro ao deletar produto:', data.message)
        // Lida com erros ou exibe mensagens de erro para o usuário
      }
    } catch (error: any) {
      console.error('Erro ao deletar produto:', error.message)
      // Lida com erros de rede ou outros erros
    }
  }

  return (
    <div className="w-full">
      <h1 className="mb-5 text-xl font-bold">Produtos</h1>
      <div className="mb-5 flex w-full items-center justify-between">
        <SearchInput
          searchPlaceholder="Pesquisar pelo Produto (id / nome)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <Button
          onClick={filterProductsInStock}
          className="flex flex-row items-center gap-2 rounded-lg bg-black px-2 py-2 text-white"
        >
          {showOnlyInStock ? 'Mostrar Todos' : 'Mostrar produtos sem stock'}
          <FilterIcon />
        </Button>
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
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Stock
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
                      src={`/uploads/products/${getCategoryDirectory(Product.category)}/${Product.image}`}
                      alt={Product.name}
                      width={70}
                      height={70}
                      className="h-[70px] w-[70px] object-contain"
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
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium ">
                    {Product.stock}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    <div className="flex flex-row items-center gap-2 ">
                      <SeeProductModal
                        Product={Product}
                        ingredients={Product.ingredients}
                      />
                      <DeleteProductModal productId={Product.id} />
                      <EditProductModal
                        product={Product}
                        Ingredients={Product.ingredients}
                      />
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
