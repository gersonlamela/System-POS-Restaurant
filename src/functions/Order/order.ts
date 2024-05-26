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
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/getOrders`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
      },
    )

    if (result.ok) {
      const data = await result.json()
      console.log(data.orders)
      // Verifique se data.orders é um array
      return Array.isArray(data.orders) ? data.orders : []
    } else {
      console.error('Error fetching orders:', result.statusText)
      return []
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}
