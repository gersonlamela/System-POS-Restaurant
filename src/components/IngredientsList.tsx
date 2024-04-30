import React from 'react'

import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import { ProductWithIngredients } from '@/types/Product'

interface IngredientsListProps {
  product: ProductWithIngredients
}

export default function IngredientsList({ product }: IngredientsListProps) {
  return (
    <Carousel orientation="horizontal" className="w-full rounded-lg  ">
      <CarouselContent>
        {product ? (
          product.ProductIngredient.map((productIngredients) => (
            <CarouselItem
              key={productIngredients.ingredient.id}
              className=" flex max-w-[100px] basis-1/2 flex-col  items-center justify-center gap-2 "
            >
              <img
                src={`/uploads/ingredients/${productIngredients.ingredient.image}`}
                alt={productIngredients.ingredient.name}
                className="h-[40px] object-contain "
              />

              <div className="flex flex-col items-center gap-2 text-center ">
                <span> {productIngredients.ingredient.name}</span>
                <span> Qtd. {productIngredients.quantity} </span>
              </div>
            </CarouselItem>
          ))
        ) : (
          <div className="text-gray-500">Carregando ingredientes...</div>
        )}
      </CarouselContent>
    </Carousel>
  )
}
