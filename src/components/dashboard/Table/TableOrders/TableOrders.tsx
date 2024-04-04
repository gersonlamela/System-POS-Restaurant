'use client'

import TablePagination from '../TablePagination'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table'

import AddOrderModal from './AddOrderModal'

import { Order as PrismaOrder, Table as table, User } from '@prisma/client'
import { getStatusOrder, getStatusStyleOrder } from '@/functions/Order/order'
import AddUserModal from '../TableUsers/AddUserModal'

// Defina uma interface para representar um produto
interface Order extends PrismaOrder {
  User: User | undefined // Adicione a propriedade 'user' com a possibilidade de ser undefined
  Table: table | undefined // Adicione a propriedade 'table' com a possibilidade de ser undefined
}

// Defina a interface para representar os produtos com ingredientes
export interface OrdersTableProps {
  Order: Order[] // Use a interface Product em ProductWithIngredients
}

export default function TableOrders({ Order }: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [Orders, setOrders] = useState(Order)

  console.log(Order)

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
          searchPlaceholder="Pesquisar pelo Pedido (id / nif)"
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
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Criado Por
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Mesa
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Nif
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase "
              >
                Preço Final
              </TableCell>

              <TableCell
                scope="col"
                className=" TableRowacking-wider text-center text-xs font-medium uppercase "
              >
                Status
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
                        className={` h-[10px] w-[10px] rounded-full ${getStatusStyleOrder(order.status)}`}
                      />
                      {getStatusOrder(order.status)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    <div className="flex flex-row items-center gap-2 ">
                      {/*    <SeeUserModal order={order} />
                      <DeleteUserModal userId={order.id} />
                      <EditUserModal order={order} /> */}
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
        type="Pedidos"
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
