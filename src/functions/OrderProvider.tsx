/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
'use client'

import { useLocalStorage } from '@/functions/useLocalStorage'
import { useSession } from 'next-auth/react'
import { createContext, ReactNode, useContext } from 'react'
import cuid from 'cuid'; //

export interface OrderIngredient {
  id: string;
  name: string;
  quantity: number;
  image: string;
  cookingPreference?: string;
}

export interface OrderProduct {
  orderId?: string
  id: string;
  name: string;
  price: number;
  quantity: number;
  priceWithoutDiscount: number;
  image: string;
  tax: number;
  note: string;
  ingredients: OrderIngredient[];
}

export interface OrderData {
  products: OrderProduct[]
  createdAt: string
  userName: string
  totalPrice: string
}

interface OrderContextData {
  orders: Record<string, OrderData>
  addProductToOrder: (product: OrderProduct, tableNumber: string) => void
  decreaseProductQuantity: (orderId: string, productId: string, tableNumber: string) => void
  increaseProductQuantity: (orderId: string, productId: string, tableNumber: string) => void
  removeProductFromOrder: (orderId: string, productId: string, tableNumber: string) => void
  clearOrdersForTable: (tableNumber: string) => void
  createEmptyOrderForTable: (tableNumber: string) => void
  orderTotalPrice: (tableNumber: string) => number
  orderBasePrice: (tableNumber: string) => number
  orderTotalDiscount: (tableNumber: string) => number
  total: (tableNumber: string) => number
  subtotal: (tableNumber: string) => number
  totalDiscount: (tableNumber: string) => number
  totalTAX: (tableNumber: string) => number
  updateProductNote: (productId: string, tableNumber: string, newNote: string) => void
  updateIngredientQuantity: (orderId: string, productId: string, ingredientId: string, newQuantity: number, tableNumber: string, cookingPreference?: string) => void
}

const OrderContext = createContext<OrderContextData>({
  orders: {},
  addProductToOrder: () => undefined,
  decreaseProductQuantity: () => undefined,
  increaseProductQuantity: () => undefined,
  removeProductFromOrder: () => undefined,
  clearOrdersForTable: () => undefined,
  createEmptyOrderForTable: () => undefined,
  updateProductNote: () => undefined,
  updateIngredientQuantity: () => undefined,
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

  const { data: session } = useSession()

  const createEmptyOrderForTable = (tableNumber: string) => {
    const basePrice = orderTotalPrice(tableNumber);
    const formattedTotalPrice = basePrice.toFixed(2);
    setOrders({
      ...orders,
      [tableNumber]: {
        products: [],
        createdAt: new Date().toISOString(),
        userName: session?.user?.name || '',
        totalPrice: formattedTotalPrice,
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


  const updateProductNote = (productId: string, tableNumber: string, newNote: string) => {
    updateOrder(tableNumber, (order) => {
      const updatedProducts = order.products.map((product) => {
        if (product.id === productId) {
          return { ...product, note: newNote }; // Atualize a nota do produto
        }
        return product;
      });
      return { ...order, products: updatedProducts };
    });
  };
  const addProductToOrder = (product: OrderProduct, tableNumber: string) => {
    const updater = (prevOrders: Record<string, OrderData>): Record<string, OrderData> => {
      let updatedOrders: Record<string, OrderData> = { ...prevOrders };
      // Verifique se já existe um pedido para esta mesa
      if (tableNumber in prevOrders) {
        // Se já houver um pedido para esta mesa, adicione o produto a esse pedido
        const existingOrder = prevOrders[tableNumber];
        const updatedProducts = [...existingOrder.products, { ...product, orderId: cuid() }]; // Adicione orderId ao produto
        // Recalcular o preço total do pedido
        const totalPrice = updatedProducts.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        );
        const formattedTotalPrice = totalPrice.toFixed(2);
        updatedOrders[tableNumber] = {
          ...existingOrder,
          products: updatedProducts,
          totalPrice: formattedTotalPrice,
        };
      } else {
        // Se não houver um pedido para esta mesa, crie um novo pedido
        const newOrder: OrderData = {
          products: [{ ...product }], // Adicione orderId ao produto
          createdAt: new Date().toISOString(),
          userName: session?.user?.name || '',
          totalPrice: product.price.toFixed(2),
        };
        updatedOrders = {
          ...prevOrders,
          [tableNumber]: newOrder,
        };
      }
      return updatedOrders;
    };
    // Verificar se o produto tem ingredientes de carne
    const hasMeatIngredient = product.ingredients.some((ingredient) => ingredient.name === 'Carne');
    // Se o produto tiver ingredientes de carne, inclua o cookingPreference
    if (hasMeatIngredient) {
      product.ingredients.forEach((ingredient) => {
        if (ingredient.name === 'Carne') {
          ingredient.cookingPreference = ''; // Defina um valor padrão ou deixe em branco inicialmente
        }
      });
    }
    const updatedOrders = updater(orders); // Atualize as ordens
    // Atualize o estado das ordens e chame orderTotalPrice
    setOrders(updatedOrders);
    orderTotalPrice(tableNumber);
  };






  const decreaseProductQuantity = (orderId: string, productId: string, tableNumber: string) => {
    const updater = (order: OrderData) => {
      if (!order || !order.products) {
        console.error(`Pedido com orderId ${orderId} não possui produtos.`);
        return order;
      }

      const productIndex = order.products.findIndex((p) => p.id === productId && p.orderId === orderId);
      if (productIndex !== -1) {
        const product = order.products[productIndex];
        if (product.quantity > 1) {
          product.quantity--;
        } else {
          // Remove o produto do pedido se a quantidade for 1
          order.products.splice(productIndex, 1);
        }
      }

      // Recalcular o preço total do pedido após diminuir a quantidade
      order.totalPrice = orderTotalPrice(tableNumber).toFixed(2);

      return { ...order };
    };
    updateOrder(tableNumber, updater);
  };

  const increaseProductQuantity = (orderId: string, productId: string, tableNumber: string) => {
    const updater = (order: OrderData) => {
      if (!order || !order.products) {
        console.error(`Pedido com orderId ${orderId} não possui produtos.`);
        return order;
      }
      const productIndex = order.products.findIndex((p) => p.id === productId && p.orderId === orderId);
      if (productIndex !== -1) {
        order.products[productIndex].quantity++;
      }
      // Recalcular o preço total do pedido após aumentar a quantidade
      order.totalPrice = orderTotalPrice(tableNumber).toFixed(2);
      return { ...order };
    };
    updateOrder(tableNumber, updater);
  };



  const removeProductFromOrder = (orderId: string, productId: string, tableNumber: string) => {
    const updater = (order: OrderData) => {
      if (!order || !order.products) {
        console.error(`Pedido com orderId ${orderId} não possui produtos.`);
        return order;
      }
      const productIndex = order.products.findIndex((p) => p.id === productId && p.orderId === orderId);
      if (productIndex !== -1) {
        const removedProduct = order.products.splice(productIndex, 1)[0]; // Remove o produto e obtém o produto removido
        // Verifica se totalPrice pode ser convertido em número
        const totalPriceNumeric = parseFloat(order.totalPrice);
        const productPriceNumeric = removedProduct.price;
        const productQuantityNumeric = removedProduct.quantity; // A quantidade do produto já é um número, então não precisamos converter
        if (!isNaN(totalPriceNumeric) && !isNaN(productPriceNumeric)) {
          // Subtrai o valor do produto removido do totalPrice
          const newTotalPrice = totalPriceNumeric - productPriceNumeric * productQuantityNumeric;
          order.totalPrice = newTotalPrice.toFixed(2); // Atualizamos o totalPrice com duas casas decimais
        } else {
          console.error('O totalPrice ou preço do produto não pôde ser convertido em um número.');
        }
      }
      return { ...order };
    };
    updateOrder(tableNumber, updater);
  };




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
      (total, product) => total + ((product.priceWithoutDiscount - product.price) * product.quantity),
      0
    );


    // Calculate the discount by subtracting the base price from the total price
    const discount = totalPrice;

    return discount;
  };
  const total = (tableNumber: string) =>
    parseFloat(orderTotalPrice(tableNumber).toFixed(2))

  const subtotal = (tableNumber: string) =>
    total(tableNumber) - totalDiscount(tableNumber) - totalTAX(tableNumber)

  const totalDiscount = (tableNumber: string) =>
    parseFloat(orderTotalDiscount(tableNumber).toFixed(2))

  const totalTAX = (tableNumber: string) => {
    const orderData = orders[tableNumber];
    if (!orderData) return 0; // Retorna 0 se não houver dados de pedido para a mesa especificada

    // Calcula o total do IVA para todos os produtos
    const totalTax = orderData.products.reduce((acc, product) => {
      // Calcula o preço do produto sem IVA
      const productPriceWithoutTax = product.price / (1 + (product.tax / 100));
      // Calcula o valor total do IVA para este produto
      const productTax = (product.price - productPriceWithoutTax) * product.quantity;
      // Soma o valor total do IVA ao acumulador
      return acc + productTax;
    }, 0);

    // Retorna o total do IVA
    return parseFloat(totalTax.toFixed(2));
  };




  const updateIngredientQuantity = (
    orderId: string,
    productId: string,
    ingredientId: string,
    newQuantity: number,
    tableNumber: string,
    cookingPreference?: string // Adicione o parâmetro cookingPreference
  ) => {
    updateOrder(tableNumber, (order) => {
      // Verifique se o pedido existe e possui a propriedade 'products'
      if (!order || !order.products) {
        console.error(`Pedido com orderId ${orderId} não encontrado ou não possui produtos.`);
        return order;
      }
      // Verifique se o pedido possui o produto com productId e orderId especificados
      const productToUpdate = order.products.find(product => product.id === productId && product.orderId === orderId);
      if (!productToUpdate) {
        console.error(`Produto com productId ${productId} e orderId ${orderId} não encontrado no pedido.`);
        return order;
      }
      // Clone o pedido para não modificar o original diretamente
      const updatedOrder = { ...order };

      // Clone o produto para não modificar o original diretamente
      const updatedProduct = { ...productToUpdate };

      // Localize o ingrediente correspondente pelo ingredientId
      const updatedIngredients = updatedProduct.ingredients.map((ingredient) => {
        if (ingredient.id === ingredientId) {
          // Atualize a quantidade do ingrediente para newQuantity
          const updatedIngredient = { ...ingredient, quantity: newQuantity };
          // Verificar se o ingrediente é carne e, se for, incluir o cookingPreference
          if (ingredient.name === 'Carne') {
            updatedIngredient.cookingPreference = cookingPreference;
          }
          return updatedIngredient;
        }
        return ingredient;
      });
      // Atualize o produto com os ingredientes atualizados
      updatedProduct.ingredients = updatedIngredients;
      // Atualize o pedido com o produto atualizado
      const productIndex = updatedOrder.products.findIndex(product => product.id === productId && product.orderId === orderId);
      updatedOrder.products[productIndex] = updatedProduct;
      // Retorne o pedido com os produtos atualizados
      return updatedOrder;
    });
  };







  const contextValue: OrderContextData = {
    orders,
    addProductToOrder,
    updateProductNote,
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
    updateIngredientQuantity,

  }

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderProvider
