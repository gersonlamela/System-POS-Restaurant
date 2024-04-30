/* eslint-disable prettier/prettier */

'use client'
import { useEffect, useState } from 'react';
import { Trash } from '@phosphor-icons/react';
import { NumberIncrease } from './NumberIncrease';
import { OrderProduct, useOrder } from '@/functions/OrderProvider';
import { ProductCategory } from '@prisma/client';
import { handleGetCategoryByCategoryId } from '@/functions/Product/product';
import Image from 'next/image';
import { NotePopup } from './NotePopup';

import { handleGetIngredientsByProductId } from '@/functions/Ingredients/ingredients';
import { IngredientsProduct } from '@/types/Product';
import { EditOrderPopUp } from './EditOrderPopUp';

interface OrderItemProps {
  product: OrderProduct;
  tableNumber: string;
  orderId: string;
}

export function OrderItem({ orderId, product, tableNumber }: OrderItemProps) {
  const [note, setNote] = useState(product.note);
  const [category, setCategory] = useState<ProductCategory>();
  const { decreaseProductQuantity, increaseProductQuantity, removeProductFromOrder, updateProductNote } = useOrder();

  const [ingredients, setIngredients] = useState<IngredientsProduct[]>([])






  const handleRemoveProductClick = () => {
    if (product.orderId) {
      removeProductFromOrder(product.orderId, product.id, tableNumber);
    }
  };

  const handleConfirmNote = (newNote: string) => {
    setNote(newNote);
    updateProductNote(product.id, tableNumber, newNote); // Atualize a nota do produto no provedor de pedidos
  };

  useEffect(() => {
    const fetchCategory = async () => {
      if (product.id) {
        try {
          const fetchedCategory = await handleGetCategoryByCategoryId(product?.id);
          setCategory(fetchedCategory);
        } catch (error) {
          console.error('Error fetching tables:', error);
        }
      }
    };
    const fetchIngredients = async () => {
      try {
        const ingredients = await handleGetIngredientsByProductId(product.id)
        setIngredients(ingredients)

        console.log('ingredients', ingredients)
      } catch (error) {
        console.error('Error fetching Ingredients:', error)
      }
    }
    fetchIngredients()
    fetchCategory();
  }, [product.id]);


  if (!orderId) {
    return null
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex w-full flex-row items-center gap-[15px]">
        <div className="h-[70px] w-[70px] rounded-[5px] ">
          {category?.name && (
            <Image
              width={70}
              height={70}
              src={`/uploads/products/${product.image}`}
              alt={product.name}
              className="h-[70px] w-[70px] object-contain"
              priority
            />
          )}
        </div>
        <div className="flex flex-col">
          <div className="text-base font-semibold">{product.name}</div>
          <div className="flex gap-[5px] text-[12px] font-semibold">
            {product.price.toFixed(2)}€
            {product.priceWithoutDiscount && product.priceWithoutDiscount !== product.price ? (
              <span
                className="text-[10px] font-semibold text-primary"
                style={{ textDecoration: 'line-through' }}
              >
                {product.priceWithoutDiscount.toFixed(2)}€
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-between">

        <NotePopup currentNote={note} onConfirm={handleConfirmNote} />
        <div className="h-full border border-l-2 border-[#ECEDED]"></div>
        <div className="flex items-center justify-center gap-[14px] text-[#A9A9A9]">
          <EditOrderPopUp tableNumber={tableNumber} ProductIngredient={ingredients} product={product} orderId={product.orderId} />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <NumberIncrease
          orderId={product.orderId}
          tableNumber={tableNumber}
          decreaseProductQuantity={decreaseProductQuantity}
          increaseProductQuantity={increaseProductQuantity}
          productId={product.id}
          quantity={product.quantity}
        />
        <div
          onClick={handleRemoveProductClick}
          className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white text-primary shadow hover:bg-primary hover:text-white"
        >
          <Trash size={16} />
        </div>
      </div>
    </div>
  );
}
