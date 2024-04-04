'use client'

import {
  Order as PrismaOrder,
  Table as table,
  User,
  ProductIngredient,
  Ingredient,
  OrderIngredient,
} from '@prisma/client'
import { getStatusOrder, getStatusStyleOrder } from '@/functions/Order/order'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import TablePagination from '../TablePagination'
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { FilterIcon } from 'lucide-react'
import AddProductModal from '../TableProducts/AddProductModal'
import AddOrderModal from './AddOrderModal'

interface Order extends PrismaOrder {
  User?: User
  Table?: table
  products: {
    id: string
    name: string
    ingredients: ProductIngredient[]
    quantity: number
  }[]
  OrderIngredient: {
    ingredient: Ingredient
    quantity: number
  }[] // Aqui está a correção para definir OrderIngredient como uma matriz
}

export interface OrdersTableProps {
  Order: Order[]
  Ingredient: Ingredient[]
}

export default function TableOrders({ Order, Ingredient }: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [Orders, setOrders] = useState<Order[]>(Order)

  const filteredOrders = Orders
    ? Orders?.filter(
        (Orders) =>
          Orders.orderId
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          Orders.nif?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Function to handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1) // Reset to TableCelle first page
  }

  // Slice TableCelle filtered users array to only include users for TableCelle current page
  const indexOfLastOrder = currentPage * itemsPerPage
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  )

  return (
    <div className="w-full">
      <h1 className="mb-5 text-xl font-bold">Pedidos</h1>
      <div className="mb-5 flex w-full items-center justify-between">
        <SearchInput
          searchPlaceholder="Pesquisar pelo Pedido (id / nome)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <AddOrderModal />
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full ">
          <TableHeader className="">
            <TableRow>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Order ID
              </TableCell>
              <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                Criado Por
              </TableCell>
              <TableCell className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase ">
                Mesa
              </TableCell>
              <TableCell className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase ">
                Nif
              </TableCell>
              <TableCell className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase ">
                Preço Final
              </TableCell>

              <TableCell className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase ">
                Status
              </TableCell>

              <TableCell className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase ">
                Produtos
              </TableCell>
              <TableCell className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase ">
                Ingredients
              </TableCell>
              <TableCell className=" TableRowacking-wider text-center text-xs font-medium uppercase ">
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>

          <tbody className="">
            {currentOrders.length ? (
              currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm ">
                    {order.orderId}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm">
                    {order.User?.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {order.Table?.number}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium ">
                    {order.nif}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium ">
                    {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 1,
                    }).format(order.totalPrice)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4  text-sm ">
                    <div className="flex flex-row items-center  justify-center gap-2">
                      <div
                        className={` h-[10px] w-[10px] rounded-full ${getStatusStyleOrder(
                          order.status,
                        )}`}
                      />
                      {getStatusOrder(order.status)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    <div className="flex h-8 flex-col items-center gap-1 overflow-scroll ">
                      {order.products.map((product) => (
                        <div key={product.id}>
                          <p>{product.name}</p>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    <div className="flex h-8 flex-col items-center gap-1 overflow-scroll">
                      {order.OrderIngredient?.map((orderIngredient, index) => (
                        <div key={index}>
                          <ul>
                            <li key={index}>
                              {orderIngredient.ingredient.name}
                              {orderIngredient?.quantity}
                            </li>
                          </ul>
                        </div>
                      ))}
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
                  Nenhum pedido encontrado
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
        filteredItemsTotal={filteredOrders.length}
      />
    </div>
  )
}
