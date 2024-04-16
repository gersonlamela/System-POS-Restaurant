/* eslint-disable prettier/prettier */
'use client'

import { useLocalStorage } from '@/functions/useLocalStorage'
import { createContext, ReactNode, useContext } from 'react'

export interface OrderProduct {
  id: string
  name: string
  price: number
  quantity: number
  priceWithoutDiscount: number
}

interface OrderData {
  products: OrderProduct[]
  createdAt: string // Storing the creation time
  userName: string
}

interface OrderContextData {
  orders: Record<string, OrderData>
  addProductToOrder: (product: OrderProduct, tableNumber: string) => void
  decreaseProductQuantity: (productId: string, tableNumber: string) => void
  increaseProductQuantity: (productId: string, tableNumber: string) => void
  removeProductFromOrder: (productId: string, tableNumber: string) => void
  clearOrdersForTable: (tableNumber: string) => void
  createEmptyOrderForTable: (tableNumber: string, userName: string) => void
  orderTotalPrice: (tableNumber: string) => number
  orderBasePrice: (tableNumber: string) => number
  orderTotalDiscount: (tableNumber: string) => number
  total: (tableNumber: string) => number
  subtotal: (tableNumber: string) => number
  totalDiscount: (tableNumber: string) => number
  totalTAX: (tableNumber: string) => number
}

const OrderContext = createContext<OrderContextData>({
  orders: {},
  addProductToOrder: () => undefined,
  decreaseProductQuantity: () => undefined,
  increaseProductQuantity: () => undefined,
  removeProductFromOrder: () => undefined,
  clearOrdersForTable: () => undefined,
  createEmptyOrderForTable: () => undefined,
  orderTotalPrice: () => 0,
  orderBasePrice: () => 0,
  orderTotalDiscount: () => 0,
  total: () => 0,
  subtotal: () => 0,
  totalDiscount: () => 0,
  totalTAX: () => 0,
})

export const useOrder = () => useContext(OrderContext)

const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useLocalStorage<Record<string, OrderData>>(
    '@pos/orders',
    {},
  )

  const createEmptyOrderForTable = (tableNumber: string, userName: string) => {
    setOrders({
      ...orders,
      [tableNumber]: {
        products: [],
        createdAt: new Date().toISOString(),
        userName,
      },
    })
  }

  const clearOrdersForTable = (tableNumber: string) => {
    const { [tableNumber]: omit, ...rest } = orders
    setOrders(rest)
  }

  const updateOrder = (
    tableNumber: string,
    updater: (order: OrderData) => OrderData,
  ) => {
    setOrders({
      ...orders,
      [tableNumber]: updater(orders[tableNumber]),
    })
  }

  const addProductToOrder = (product: OrderProduct, tableNumber: string) => {
    const updater = (order: OrderData) => {
      const existingProduct = order.products.find((p) => p.id === product.id)
      if (existingProduct) {
        existingProduct.quantity++
      } else {
        order.products.push({ ...product, quantity: 1 })
      }
      return { ...order }
    }
    updateOrder(tableNumber, updater)
  }

  const decreaseProductQuantity = (productId: string, tableNumber: string) => {
    const updater = (order: OrderData) => {
      const product = order.products.find((p) => p.id === productId)
      if (product && product.quantity > 1) {
        product.quantity--
      } else {
        order.products = order.products.filter((p) => p.id !== productId)
      }
      return { ...order }
    }
    updateOrder(tableNumber, updater)
  }

  const increaseProductQuantity = (productId: string, tableNumber: string) => {
    const updater = (order: OrderData) => {
      const product = order.products.find((p) => p.id === productId)
      if (product) {
        product.quantity++
      }
      return { ...order }
    }
    updateOrder(tableNumber, updater)
  }

  const removeProductFromOrder = (productId: string, tableNumber: string) => {
    const updater = (order: OrderData) => {
      order.products = order.products.filter((p) => p.id !== productId)
      return { ...order }
    }
    updateOrder(tableNumber, updater)
  }

  const orderTotalPrice = (tableNumber: string) => {
    const order = orders[tableNumber];
    return order && order.products // Check if order and order.products are not undefined
      ? order.products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      )
      : 0;
  };

  const orderBasePrice = (tableNumber: string) => orderTotalPrice(tableNumber)

  const orderTotalDiscount = (tableNumber: string) => {
    const order = orders[tableNumber];
    if (!order) return 0; // If order doesn't exist, return 0 discount

    // Calculate the total price of all products
    const totalPrice = order.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    // Calculate the base price (subtotal) of the order
    const basePrice = orderBasePrice(tableNumber);

    // Calculate the discount by subtracting the base price from the total price
    const discount = totalPrice - basePrice;

    return discount;
  };
  const total = (tableNumber: string) =>
    parseFloat(orderTotalPrice(tableNumber).toFixed(2))

  const subtotal = (tableNumber: string) =>
    parseFloat(orderTotalPrice(tableNumber).toFixed(2))

  const totalDiscount = (tableNumber: string) =>
    parseFloat(orderTotalPrice(tableNumber).toFixed(2)) -
    parseFloat(subtotal(tableNumber).toFixed(2))

  const totalTAX = (tableNumber: string) => {
    const subtotalValue = subtotal(tableNumber)
    const ivaPercentage = 0.23 // You can change this according to your requirement
    return parseFloat((subtotalValue * ivaPercentage).toFixed(2))
  }

  const contextValue: OrderContextData = {
    orders,
    addProductToOrder,
    decreaseProductQuantity,
    increaseProductQuantity,
    removeProductFromOrder,
    clearOrdersForTable,
    createEmptyOrderForTable,
    orderTotalPrice,
    orderBasePrice,
    orderTotalDiscount,
    total,
    subtotal,
    totalDiscount,
    totalTAX,
  }

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderProvider
