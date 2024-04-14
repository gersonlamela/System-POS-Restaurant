'use client'

import { useLocalStorage } from '@/functions/useLocalStorage'
import { createContext, ReactNode, useContext } from 'react'

export interface OrderProduct {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderContextData {
  orders: Record<string, OrderProduct[]>
  addProductToOrder: (product: OrderProduct, tableNumber: string) => void
  decreaseProductQuantity: (productId: string, tableNumber: string) => void
  increaseProductQuantity: (productId: string, tableNumber: string) => void
  removeProductFromOrder: (productId: string, tableNumber: string) => void
  orderTotalPrice: (tableNumber: string) => number
  orderBasePrice: (tableNumber: string) => number
  orderTotalDiscount: (tableNumber: string) => number
  total: (tableNumber: string) => number
  subtotal: (tableNumber: string) => number
  totalDiscount: (tableNumber: string) => number
}

const OrderContext = createContext<OrderContextData>({
  orders: {},
  addProductToOrder: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromOrder: () => {},
  orderTotalPrice: () => 0,
  orderBasePrice: () => 0,
  orderTotalDiscount: () => 0,
  total: () => 0,
  subtotal: () => 0,
  totalDiscount: () => 0,
})

export const useOrder = () => useContext(OrderContext)

const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useLocalStorage<Record<string, OrderProduct[]>>(
    '@pos/orders',
    {},
  )

  const addProductToOrder = (product: OrderProduct, tableNumber: string) => {
    // Verificar se a mesa já existe
    const currentOrders = { ...orders }

    if (currentOrders[tableNumber]) {
      const currentMesa = [...currentOrders[tableNumber]]

      const existingProductIndex = currentMesa.findIndex(
        (item) => item.id === product.id,
      )

      if (existingProductIndex !== -1) {
        currentMesa[existingProductIndex].quantity += 1
      } else {
        currentMesa.push({ ...product, quantity: 1 })
      }

      currentOrders[tableNumber] = currentMesa
    } else {
      // Se a mesa não existir, criar uma nova entrada para ela
      currentOrders[tableNumber] = [{ ...product, quantity: 1 }]
    }

    // Atualizar o estado orders
    setOrders(currentOrders)
  }

  const decreaseProductQuantity = (productId: string, tableNumber: string) => {
    // Verificar se a mesa já existe
    if (orders[tableNumber]) {
      const currentMesa = [...orders[tableNumber]]

      const updatedProducts = currentMesa
        .map((product) => {
          if (product.id === productId) {
            return {
              ...product,
              quantity: product.quantity - 1,
            }
          }
          return product
        })
        .filter((product) => product.quantity > 0)

      setOrders({ ...orders, [tableNumber]: updatedProducts })
    }
  }

  const increaseProductQuantity = (productId: string, tableNumber: string) => {
    // Verificar se a mesa já existe
    if (orders[tableNumber]) {
      const currentMesa = [...orders[tableNumber]]

      const updatedProducts = currentMesa.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          }
        }
        return product
      })

      setOrders({ ...orders, [tableNumber]: updatedProducts })
    }
  }

  const removeProductFromOrder = (productId: string, tableNumber: string) => {
    // Verificar se a mesa já existe
    if (orders[tableNumber]) {
      const currentMesa = orders[tableNumber]
      const updatedProducts = currentMesa.filter(
        (product) => product.id !== productId,
      )

      setOrders({ ...orders, [tableNumber]: updatedProducts })
    }
  }

  const orderTotalPrice = (tableNumber: string) => {
    // Calcular o preço total da mesa
    const currentMesa = orders[tableNumber] || []
    return currentMesa.reduce((acc, product) => {
      return acc + product.price * product.quantity
    }, 0)
  }

  const orderBasePrice = (tableNumber: string) => orderTotalPrice(tableNumber)

  const orderTotalDiscount = (tableNumber: string) => {
    // Calcular o desconto total da mesa
    const currentMesa = orders[tableNumber] || []
    const subtotal = currentMesa.reduce((acc, product) => {
      return acc + product.price * product.quantity
    }, 0)
    return subtotal - orderTotalPrice(tableNumber)
  }

  const total = (tableNumber: string) => orderTotalPrice(tableNumber)

  const subtotal = (tableNumber: string) => orderTotalPrice(tableNumber)

  const totalDiscount = (tableNumber: string) =>
    orderTotalPrice(tableNumber) - subtotal(tableNumber)

  const contextValue: OrderContextData = {
    orders,
    addProductToOrder,
    decreaseProductQuantity,
    increaseProductQuantity,
    removeProductFromOrder,
    orderTotalPrice,
    orderBasePrice,
    orderTotalDiscount,
    total,
    subtotal,
    totalDiscount,
  }

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderProvider
