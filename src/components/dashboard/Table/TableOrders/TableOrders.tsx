/* eslint-disable prettier/prettier */
'use client';

import { getStatusOrder, getStatusStyleOrder } from '@/functions/Order/order';
import { useEffect, useState } from 'react';
import { SearchInput } from '../TableSearchItem';
import TablePagination from '../TablePagination';
import { Table, TableCell, TableHeader, TableRow } from '@/components/ui/table';

import { Order } from '@/types/Order';
import SeeOrderModal from './SeeOrderModal';

export interface OrdersTableProps {
  orders: Order[]; // Corrigido para "orders" em vez de "Order"
}

export default function TableOrders({ orders }: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Corrigido para "filteredOrders" em vez de "Orders"


  // Atualização dos pedidos filtrados quando a lista de pedidos é alterada
  useEffect(() => {
    if (orders) {
      const filtered = orders.filter((order) =>
        order.orderId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.NifClient?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
      setCurrentPage(1); // Redefine para a primeira página ao filtrar
    }
  }, [orders, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Função para lidar com a mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Função para lidar com a mudança de itens por página
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Redefine para a primeira página
  };

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
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
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
