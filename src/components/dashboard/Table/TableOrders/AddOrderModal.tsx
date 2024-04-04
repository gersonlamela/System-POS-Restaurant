import React, { FormEvent, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CircleNotch, Plus } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { handleGetIngredients } from '@/functions/Ingredients/ingredients'
import { Order, ProductCategory, ProductIngredient, Tax } from '@prisma/client'
import { handleGetProducts } from '@/functions/Product/product'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import NumberInputWithIcons from '../../NumberInputQuantity'
import { max } from 'date-fns'

const OrderSchema = z.object({
  productId: z.string(),
  ingredient: z.array(
    z.object({
      ingredientId: z.string(),
      quantity: z.number(),
    }),
  ),
})

const FormSchema = z.object({
  nif: z.string().optional(),
  status: z.string().optional(),

  orders: z.array(OrderSchema),
})

interface Product {
  id: string
  name: string
  price: number
  image: string
  tax: Tax
  discount: number | null
  category: ProductCategory
  stock: number | null
  createdAt: Date
  updatedAt: Date
  productIngredients: ProductIngredient[] // Adicionando a propriedade productIngredients
}

export interface Ingredient {
  id: string
  name: string
  price: number
  image: string
  createdAt: Date
  orders: Order[]
  products: ProductIngredient[]
}

interface DefaultOrder {
  productId: string
  ingredient: { ingredientId: string; quantity: number }[]
}

const AddOrderModal = () => {
  const { data: session, status } = useSession()
  const [availableIngredients, setAvailableIngredients] = useState<
    Ingredient[]
  >([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])

  const defaultOrder: DefaultOrder = {
    productId: '',
    ingredient: [{ ingredientId: '', quantity: 0 }],
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nif: '',
      status: 'PENDING',

      orders: [defaultOrder],
    },
    mode: 'onChange',
  })

  const { handleSubmit, reset, control, setValue } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'orders' })

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const formData = {
      ...values,
      status: 'PENDING',
      userId: session?.user.id,
      tableId: 'clulirt2g000g72jnyq7m7eed',
    }
    console.log(formData)
    try {
      const response = await fetch(
        'http://localhost:3000/api/order/createOrder',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        },
      )

      const data = await response.json()
      if (response.ok) {
        /*  location.href = '/dashboard/orders' */
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('There was an error', error)
    }
  }

  useEffect(() => {
    handleGetIngredients().then(setAvailableIngredients)
    handleGetProducts().then(setAvailableProducts)
  }, [])

  const addOrder = () => {
    const defaultOrder: DefaultOrder = availableProducts.map((product) => ({
      productId: product.id,
      ingredient: product.productIngredients.map((ingredient) => ({
        ingredientId: ingredient.ingredientId,
        quantity: ingredient.quantity || 0, // Use a quantidade padrão do ingrediente, ou 0 se não houver
      })),
    }))[0] // Obtém apenas o primeiro elemento de defaultOrders

    append(defaultOrder)
  }

  return (
    <Dialog>
      <DialogTrigger
        className="flex flex-row items-center gap-2 rounded-lg bg-black px-2 py-2 text-white"
        onClick={() => reset()}
      >
        <Plus size={16} weight="bold" />
        Adicionar Pedido
      </DialogTrigger>
      <DialogContent className="h-auto min-w-[630px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center">
            Adicionar Pedido
          </DialogTitle>
          <hr />
          <DialogDescription className="w-full">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6"
              >
                <FormField
                  name="nif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-black">
                        NIF
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          maxLength={9}
                          className="bg-zinc-50 text-black"
                          placeholder="NIF"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="mt-2 text-red-500" />
                    </FormItem>
                  )}
                />

                {fields.map((order, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <select
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        value={order.productId}
                        onChange={(e) => {
                          const productId = e.target.value
                          const updatedOrders = [...form.getValues('orders')]
                          const selectedProduct = availableProducts.find(
                            (product) => product.id === productId,
                          )
                          const productIngredients =
                            selectedProduct?.productIngredients.map(
                              (ingredient) => ({
                                ingredientId: ingredient.ingredientId,
                                quantity: ingredient.quantity || 0, // Quantidade inicial do ingrediente
                              }),
                            ) || []
                          updatedOrders[index] = {
                            ...order,
                            productId,
                            ingredient: productIngredients,
                          }
                          setValue('orders', updatedOrders, {
                            shouldDirty: true,
                          })
                        }}
                        name={`orders[${index}].productId`}
                      >
                        <option value="" disabled>
                          Selecione um produto
                        </option>
                        {availableProducts.map((productOption) => (
                          <option
                            key={productOption.id}
                            value={productOption.id}
                          >
                            {productOption.name}
                          </option>
                        ))}
                      </select>
                      <Button type="button" onClick={() => remove(index)}>
                        Remover
                      </Button>
                    </div>
                    {order.productId && (
                      <div className="grid grid-cols-2 gap-4">
                        {order.ingredient.map((ingredient, ingredientIndex) => {
                          const productIngredient = availableProducts
                            .find((product) => product.id === order.productId)
                            ?.productIngredients.find(
                              (productIngredient) =>
                                productIngredient.ingredientId ===
                                ingredient.ingredientId,
                            )
                          const minQuantity = productIngredient?.quantity || 0
                          const maxQuantity =
                            productIngredient?.maxQuantity || 9999
                          const ingredientName = availableIngredients.find(
                            (Ingredient) =>
                              Ingredient.id ===
                              order.ingredient[ingredientIndex].ingredientId,
                          )?.name

                          return (
                            <div key={ingredientIndex}>
                              <NumberInputWithIcons
                                label={ingredientName || ''}
                                min={0}
                                max={maxQuantity}
                                value={ingredient.quantity}
                                onChange={(updatedQuantity) => {
                                  if (
                                    updatedQuantity >= 0 &&
                                    updatedQuantity <= maxQuantity
                                  ) {
                                    const updatedOrders = [
                                      ...form.getValues('orders'),
                                    ]
                                    updatedOrders[index].ingredient[
                                      ingredientIndex
                                    ].quantity = updatedQuantity
                                    form.reset({ orders: updatedOrders })
                                  }
                                }}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-white hover:bg-red-500"
                    >
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={addOrder}>
                    Adicionar Pedido
                  </Button>
                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    variant="outline"
                    className="hover:bg-green-500 hover:text-white"
                  >
                    {status === 'loading' ? (
                      <CircleNotch size={16} className="animate-spin" />
                    ) : (
                      'Criar Ordem'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddOrderModal
