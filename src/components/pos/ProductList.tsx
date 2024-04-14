'use client'

import { getTax } from '@/functions/Product/product'
import { useOrder } from '@/functions/OrderProvider'

import { Product } from '@prisma/client'

interface ProductListProps {
  Products: Product[]
  tableNumber: string // Adicione o número da mesa como uma propriedade
}

export function ProductList({ Products, tableNumber }: ProductListProps) {
  return (
    <div className="grid max-h-[771px] w-full flex-1 grid-cols-auto-fill-100 justify-items-center gap-[15.5px] overflow-y-auto">
      {Products ? (
        Products.map((product, index) => (
          <ProductItem
            key={index}
            product={product}
            tableNumber={tableNumber}
          />
        ))
      ) : (
        <h1>Sem Produtos</h1>
      )}
    </div>
  )
}

interface ProductItemProps {
  product: Product
  tableNumber: string
}

const ProductItem = ({ product, tableNumber }: ProductItemProps) => {
  const { addProductToOrder } = useOrder()

  const handleAddToOrder = () => {
    const price =
      product.price * (1 + getTax(product.tax) / 100) - (product.discount || 0)

    const { id, name } = product
    const newProduct = {
      id,
      name,
      price,
      quantity: 1,
    }

    addProductToOrder(newProduct, tableNumber)
  }

  return (
    <div
      className="relative flex h-[200px] w-[199.5px] cursor-pointer flex-col items-center justify-between"
      onClick={handleAddToOrder}
    >
      <div className="relative flex h-full w-full bg-third">
        <div className="flex flex-1">ola</div>
        <div className="absolute inset-0 top-[8.75rem] flex flex-col bg-black bg-opacity-30 pb-[10px] pl-[15px] pt-[8px]">
          <span className="text-base font-semibold text-white">
            {product.name}
          </span>
          <span className="text-[12px] font-semibold text-white">
            {new Intl.NumberFormat('pt-PT', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 1,
            }).format(product.price)}
          </span>
        </div>
      </div>
    </div>
  )
}
