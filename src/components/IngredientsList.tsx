import React from 'react'
import { Ingredient } from '@prisma/client'
import { Label } from './ui/label'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'

interface IngredientsListProps {
  ingredients: Ingredient[]
}

const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients }) => {
  return (
    <Carousel orientation="horizontal" className="w-full rounded-lg  ">
      <CarouselContent>
        {ingredients ? (
          ingredients.map((ingredient) => (
            <CarouselItem
              key={ingredient.id}
              className=" flex max-w-[100px] basis-1/2 flex-col  items-center justify-center gap-2 "
            >
              <img
                src={`/uploads/ingredients/${ingredient.image}`}
                alt={ingredient.name}
                className="h-[40px] object-contain "
              />

              <Label className="text-center ">{ingredient.name}</Label>
            </CarouselItem>
          ))
        ) : (
          <div className="text-gray-500">Carregando ingredientes...</div>
        )}
      </CarouselContent>
    </Carousel>
  )
}

export default IngredientsList
