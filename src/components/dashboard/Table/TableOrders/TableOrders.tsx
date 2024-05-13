/* eslint-disable prettier/prettier */
'use client'

import { getStatusOrder, getStatusStyleOrder } from '@/functions/Order/order'
import { useState } from 'react'
import { SearchInput } from '../TableSearchItem'
import TablePagination from '../TablePagination'
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table'

import { Order } from '@/types/Order'
import SeeOrderModal from './SeeOrderModal'


export interface OrdersTableProps {
  Order: Order[]
}

export default function TableOrders({ Order }: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [Orders] = useState<Order[]>(Order)

  const filteredOrders = Orders
    ? Orders?.filter(
      (Orders) =>
        Orders.orderId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        Orders.NifClient?.toLowerCase().includes(searchTerm.toLowerCase()),
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

  // Agrupar os pedidos pelo orderId
  const groupedOrders: Order[] = Object.values(
    filteredOrders.reduce((acc: Record<string, Order>, order) => {
      if (!acc[order.orderId]) {
        acc[order.orderId] = {
          ...order,
          OrderIngredient: order.OrderIngredient.map(orderItem => ({
            ingredient: orderItem.ingredient,
            orderId: orderItem.orderId,
            quantity: orderItem.quantity,
            product: orderItem.product,
            cookingPreference: orderItem.cookingPreference
          })),
        };
      } else {
        acc[order.orderId].OrderIngredient.push(
          ...order.OrderIngredient.map(orderItem => ({
            ingredient: orderItem.ingredient,
            orderId: orderItem.orderId,
            quantity: orderItem.quantity,
            product: orderItem.product,
            cookingPreference: orderItem.cookingPreference
          }))
        );
      }
      return acc;
    }, {})
  );



  console.log(groupedOrders)


  return (
    <div className="w-full">
      <h1 className="mb-5 text-xl font-bold">Pedidos</h1>
      <div className="mb-5 flex w-full items-center justify-between">
        <SearchInput
          searchPlaceholder="Pesquisar pelo Pedido (id / nif)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="">
            <TableRow>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase"
              >
                Order ID
              </TableCell>
              <TableCell className="whitespace-nowrap px-6 py-4 text-sm">
                Criado Por
              </TableCell>
              <TableCell className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase">
                Mesa
              </TableCell>
              <TableCell className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase">
                Nif
              </TableCell>
              <TableCell className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase">
                Preço Final
              </TableCell>
              <TableCell className="TableRowacking-wider px-6 py-3 text-left text-xs font-medium uppercase">
                Status
              </TableCell>
              <TableCell className="TableRowacking-wider text-center text-xs font-medium uppercase">
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>
          <tbody className="">
            {groupedOrders ? (
              groupedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm">
                    {order.orderId}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm">
                    {order.User?.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {order.Table?.number}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {order.NifClient}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 1,
                    }).format(order.totalPrice)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex flex-row items-center justify-center gap-2">
                      <div
                        className={`h-[10px] w-[10px] rounded-full ${getStatusStyleOrder(
                          order.status,
                        )}`}
                      />
                      {getStatusOrder(order.status)}
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    <div className="flex flex-row items-center gap-2 ">
                      <SeeOrderModal order={order} />
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
