import React, { useEffect, useState } from 'react'
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
import { Ingredient, Product } from '@prisma/client'
import { handleGetProducts } from '@/functions/Product/product'
import { useSession } from 'next-auth/react'
import { z } from 'zod'

const OrderSchema = z.object({
  productId: z.string(),
  ingredientIds: z.array(z.string()),
})

const FormSchema = z.object({
  nif: z.string().optional(), // Defina como opcional se necessário
  status: z.string().optional(), // Defina como opcional se necessário

  orders: z.array(OrderSchema),
})

const AddOrderModal = () => {
  const { data: session, status } = useSession()
  const [availableIngredients, setAvailableIngredients] = useState<
    Ingredient[]
  >([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])

  const defaultOrder = { productId: '', ingredientIds: [] as string[] }

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
      userId: session?.user.id,
      tableId: 'clu1l5i6m000az7s5a18kqryu',
    }
    try {
      const response = await fetch('/api/order/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (response.ok) {
        location.href = '/dashboard/orders'
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
                          const updatedOrders = [...form.getValues('orders')]
                          updatedOrders[index] = {
                            ...order,
                            productId: e.target.value,
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
                      <div>
                        {availableIngredients.map((ingredient) => (
                          <div
                            key={ingredient.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`ingredient-${order.id}-${ingredient.id}`}
                              value={ingredient.id}
                              onChange={(e) => {
                                const isChecked = e.target.checked
                                const ingredientId = ingredient.id

                                const updatedOrders = [
                                  ...form.getValues('orders'),
                                ]
                                const currentIngredientIds =
                                  updatedOrders[index].ingredientIds

                                let updatedIngredientIds: string[] // Define o tipo explicitamente como um array de strings

                                if (isChecked) {
                                  updatedIngredientIds = [
                                    ...currentIngredientIds,
                                    ingredientId,
                                  ]
                                } else {
                                  updatedIngredientIds =
                                    currentIngredientIds.filter(
                                      (id) => id !== ingredientId,
                                    )
                                }

                                updatedOrders[index] = {
                                  ...order,
                                  ingredientIds: updatedIngredientIds,
                                }

                                setValue('orders', updatedOrders, {
                                  shouldDirty: true,
                                })
                              }}
                            />
                            <label
                              htmlFor={`ingredient-${order.id}-${ingredient.id}`}
                            >
                              {ingredient.name}
                            </label>
                          </div>
                        ))}
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
