'use client'

import React, { useState, useEffect } from 'react'
import TableOrders from '@/components/dashboard/Table/TableOrders/TableOrders'
import { handleGetOrders } from '@/functions/Order/order'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await handleGetOrders()
      setOrders(fetchedOrders)
    }

    fetchOrders()
  }, [])

  console.log(orders)

  return <TableOrders orders={orders} />
}

export default OrdersPage
