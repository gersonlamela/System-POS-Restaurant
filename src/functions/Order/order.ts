import { Order } from '@prisma/client'

export function getStatusStyleOrder(status: Order['status']) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-500 text-green-400 font-bold'
    case 'PENDING':
      return 'bg-yellow-950 text-yellow-400 font-bold'
    case 'CANCELLED':
      return 'bg-red-950 text-red-400 font-bold'
  }
}

export function getStatusOrder(status: Order['status']) {
  switch (status) {
    case 'COMPLETED':
      return 'Completo'
    case 'CANCELLED':
      return 'Cancelado'
    case 'PENDING':
      return 'Pendente'
  }
}

export function getPayMethodOrder(PaymentMethod: string) {
  switch (PaymentMethod) {
    case 'BANK':
      return 'Multibanco'
    case 'CASH':
      return 'Dinheiro'
  }
}

export async function handleGetOrders() {
  const result = await fetch('http://localhost:3000/api/order/getOrders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (result.ok) {
    const data = await result.json()

    // Ensure that data is an array, if not, return an empty array
    return data.orders
  }

  // Handle non-ok response
  console.error('Error fetching orders:', result.statusText)
  return []
}
