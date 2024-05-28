/* eslint-disable prettier/prettier */
'use client';

import { getStatusOrder, getStatusStyleOrder } from '@/functions/Order/order';
import { useEffect, useState } from 'react';
import { SearchInput } from '../TableSearchItem';
import TablePagination from '../TablePagination';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

import { Order } from '@/types/Order';
import SeeOrderModal from './SeeOrderModal';
import { DeleteOrderModal } from './DeleteOrderModal';
import { format } from 'date-fns';
import { PencilSimple, Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { FilterIcon } from 'lucide-react';

export interface OrdersTableProps {
  orders: Order[];
}


export default function TableOrders({ orders }: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (orders) {
      const filtered = orders.filter((order) =>
        order.orderId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.NifClient?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
      setCurrentPage(1);
    }
  }, [orders, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-[65px] w-full">
      <div className="mb-[22px] flex w-full flex-wrap items-center justify-between gap-[15px]">
        <SearchInput
          searchPlaceholder="Pesquisar pedido (id / nif cliente)"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex flex-wrap items-center gap-[15px]">
          <div>
            <Button
              disabled
              className={`flex h-[40px] flex-row items-center gap-2  rounded-lg  border border-[#a9a9a9] bg-white px-[15px] text-[#a9a9a9]`}
            >
              <span className="text-base font-normal">
                Mostrar pedidos c/ stock
              </span>
              <FilterIcon />
            </Button>
          </div>
          <div>
            <Button
              disabled
              className={`flex h-[40px] flex-row items-center  gap-2 rounded-lg   border border-[#a9a9a9] bg-white px-[15px] text-[#a9a9a9]`}
            >
              <span className="text-base font-normal">
                Mostrar pedidos s/ desconto (%)
              </span>
              <FilterIcon />
            </Button>
          </div>

          <div>
            <button
              disabled
              className="flex  disabled:cursor-not-allowed disabled:border disabled:border-[#B5B5B5]  disabled:bg-[#B5B5B5] disabled:text-white h-[40px] flex-row items-center gap-2 rounded-lg bg-third px-[15px] text-white"
            >
              <Plus size={16} weight="bold" />
              Adicionar Pedido
            </button>
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
                Order Id
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-left text-base font-normal uppercase text-third "
              >
                Nome Funcionario
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase  text-third "
              >
                Numero da Mesa
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase  text-third "
              >
                Nif Cliente
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase  text-third "
              >
                Preço Final
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase  text-third "
              >
                Horario
              </TableCell>
              <TableCell
                scope="col"
                className="TableRowacking-wider px-6 py-3 text-center text-base font-normal uppercase  text-third "
              >
                Status
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
            {currentOrders?.length ? (
              currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal text-third">
                    {order.orderId}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-base font-normal  text-third">
                    {order.User?.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal  text-third  ">
                    {order.Table?.number}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal  text-third  ">
                    {order.NifClient}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal  text-third  ">
                    {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 1,
                    }).format(order.totalPrice)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal  text-third  ">
                    {format(new Date(order.dateOrder), "MM/dd/yyyy : HH:mm:ss")}

                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4 text-center text-base font-normal text-third  ">
                    <div className="flex flex-row items-center justify-center gap-2">
                      <div
                        className={`h-[10px] w-[10px] rounded-full ${getStatusStyleOrder(
                          order.status,
                        )}`}
                      />
                      {getStatusOrder(order.status)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-4  text-base font-normal">
                    <div className="flex flex-row items-center justify-center gap-2 ">
                      <button
                        className="flex disabled:cursor-not-allowed disabled:text-[#B5B5B5] disabled:border disabled:border-[#B5B5B5]  h-[40px] w-[40px] items-center justify-center rounded-[5px]  border border-third bg-white text-third shadow-button5"
                        disabled
                      >
                        <PencilSimple size={20} />
                      </button>
                      <SeeOrderModal order={order} />
                      <DeleteOrderModal orderId={order.id} />
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
