/* eslint-disable prettier/prettier */
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
import { CircleNotch, PencilSimple, Trash } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
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
import { UploadCloud } from 'lucide-react'
import { Ingredient, ProductCategory } from '@prisma/client'
import { handleGetIngredients } from '@/functions/Ingredients/ingredients'
import { ProductWithIngredients } from '@/types/Product'
import { handleGetProductsCategory } from '@/functions/Product/product'
import { NumberIncrease } from '../../NumberIncrease'

const TaxEnum = z.enum(['REDUCED', 'INTERMEDIATE', 'STANDARD'])

const FormSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório.'),
  price: z.number().positive('O preço deve ser um valor positivo.'),
  image: z.any(),
  ingredients: z.any(),
  tax: TaxEnum,
  discount: z.number().optional(),
  category: z.string(),
  stock: z.number(),
})

interface EditProductModalProps {
  Product: ProductWithIngredients
}

export default function EditProductModal({ Product }: EditProductModalProps) {
  const [file, setFile] = useState<File>()
  const [category, setCategory] = useState<ProductCategory[]>([])

  const [imagePreview, setImagePreview] = useState<string>(
    `/uploads/products/${Product.image}`,
  )
  const [selectedIngredients, setSelectedIngredients] = useState<
    { id: string; quantity: number }[]
  >(() => {
    return Product.ProductIngredient
      ? Product.ProductIngredient.map((ingredient) => ({
        id: ingredient.ingredient.id,
        quantity: ingredient.quantity,
      }))
      : []
  })

  const [searchValue, setSearchValue] = useState('')

  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  useEffect(() => {
    handleGetIngredients().then((data) => {
      setIngredients(data)
    })
  }, [])

  useEffect(() => {
    handleGetProductsCategory().then((data) => {
      setCategory(data)
    })
  }, [])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: Product.name,
      price: Product.price,
      image: Product.image,
      tax: Product.tax,
      ingredients: selectedIngredients,
      discount: Product.discount || 0,
      category: Product.ProductCategory.id,
      stock: Product.stock || 0,
    },
  })

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log(values)

    try {
      const formData = new FormData()

      if (file) {
        // Adiciona a imagem do produto ao FormData
        formData.append('file', file)
      }

      // Adiciona os outros campos ao FormData conforme necessário
      formData.append('name', values.name)
      formData.append('price', values.price.toString())
      formData.append('tax', values.tax)
      if (values.discount) {
        formData.append('discount', values.discount.toString())
      }
      formData.append('category', values.category)
      formData.append('ingredients', JSON.stringify(selectedIngredients))
      formData.append('stock', values.stock.toString())

      const response = await fetch(
        `/api/product/editProduct?id=${Product.id}`,
        {
          method: 'PUT',
          body: formData,
        },
      )

      const data = await response.json()
      if (response.ok) {
        location.href = '/dashboard/products'

        toast.success('Produto atualizado com sucesso!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Houve um erro:', error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0]
      setFile(selectedFile)

      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result)
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleFileDelete = () => {
    setImagePreview('') // Clear the image preview
    setFile(undefined) // Reset the file state
  }

  const updateIngredientQuantity = (id: string, quantity: number) => {
    // Verifica se o ingrediente já está na lista de ingredientes selecionados
    const ingredientIndex = selectedIngredients.findIndex(
      (ingredient) => ingredient.id === id,
    )

    // Se o ingrediente já estiver na lista, atualiza sua quantidade
    if (ingredientIndex !== -1) {
      const updatedIngredients = [...selectedIngredients]
      updatedIngredients[ingredientIndex] = {
        ...updatedIngredients[ingredientIndex],
        quantity,
      }
      setSelectedIngredients(updatedIngredients)
    } else {
      // Se o ingrediente não estiver na lista, adiciona-o com a quantidade informada
      setSelectedIngredients([...selectedIngredients, { id, quantity }])
    }
  }

  const { reset } = form

  return (
    <>
      <Dialog>
        <DialogTrigger
          className="flex h-[40px] w-[40px] items-center justify-center rounded-[5px]  border border-third bg-white text-third shadow-button5"
          onClick={() => {
            reset()
          }}
        >
          <PencilSimple size={20} />
        </DialogTrigger>

        <DialogContent className="min-w-[630px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Editar Produto
            </DialogTitle>
            <hr />
            <DialogDescription className=" w-full ">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  <div className="mt-2 grid w-full  items-start gap-6 md:grid-cols-2">
                    {/* Campos do formulário */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Nome
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              placeholder="Nome do Produto"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Preço
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Desconto
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Stock
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-zinc-50 text-black"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Imposto
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded border bg-zinc-50 p-2 text-black"
                            >
                              <option value="REDUCED">6%</option>
                              <option value="INTERMEDIATE">13%</option>
                              <option value="STANDARD">23%</option>
                            </select>
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Categoria
                          </FormLabel>
                          <select
                            {...field}
                            className="w-full rounded border bg-zinc-50 p-2 text-black"
                          >
                            {/* Adicionando um valor padrão */}
                            <option value="" disabled selected>
                              Selecione uma categoria
                            </option>
                            {/* Mapeando as categorias */}
                            {category.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ingredients"
                      render={() => (
                        <div className="relative">
                          <label className="my-1 block font-medium text-black">
                            Ingredientes
                          </label>
                          <Input
                            type="text"
                            placeholder="Pesquisar ingredientes..."
                            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            value={searchValue}
                            onChange={(e) => {
                              setSearchValue(e.target.value.toLowerCase())
                            }}
                          />

                          <div className="absolute left-0 top-full z-10 my-1 grid max-h-[250px] w-full grid-cols-2 overflow-auto rounded-md bg-gray-100">
                            {ingredients ? (
                              ingredients
                                .filter((ingredient) =>
                                  ingredient.name
                                    .toLowerCase()
                                    .includes(searchValue),
                                )
                                .map((ingredient) => (
                                  <div
                                    key={ingredient.id}
                                    className="flex flex-wrap items-center gap-3 p-2 hover:bg-gray-100"
                                  >
                                    <img
                                      src={`/uploads/ingredients/${ingredient.image}`}
                                      alt={ingredient.name}
                                      className="h-8 w-8 object-contain"
                                    />

                                    <span className="text-sm">
                                      {ingredient.name}
                                    </span>
                                    <div className="flex w-full flex-1">
                                      <NumberIncrease
                                        value={
                                          selectedIngredients.find(
                                            (selected) =>
                                              selected.id === ingredient.id,
                                          )?.quantity || 0
                                        }
                                        onChange={(quantity) =>
                                          updateIngredientQuantity(
                                            ingredient.id,
                                            quantity,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <div>Sem Ingredientes</div>
                            )}
                          </div>
                        </div>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image"
                      render={() => (
                        <FormItem>
                          <FormLabel className="mt-4 font-medium text-black">
                            Imagem
                          </FormLabel>
                          <FormMessage className="absolute text-red-500" />
                          <FormControl>
                            {imagePreview ? (
                              <div className="relative my-4 flex h-[200px] w-[200px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 text-center">
                                <img
                                  src={imagePreview}
                                  alt={form.getValues('name')}
                                  className="h-[150px] w-[150px] object-cover"
                                  style={{ maxHeight: '200px' }}
                                />
                                <Button
                                  type="button"
                                  className="absolute right-0 top-0 rounded-full p-2 text-white transition duration-300 hover:text-red-600"
                                  onClick={() => {
                                    handleFileDelete()
                                  }}
                                >
                                  <Trash size={20} weight="bold" />
                                </Button>
                              </div>
                            ) : (
                              <div className="relative my-4 flex h-[200px] max-w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4">
                                <input
                                  type="file"
                                  required
                                  accept=".svg, .png, .jpg, .jpeg"
                                  className="absolute inset-0 h-full w-full opacity-0"
                                  onChange={handleFileChange}
                                />
                                <div className="flex flex-col items-center justify-center text-center">
                                  <UploadCloud size={50} />
                                  <p className="mt-1 text-sm text-gray-600">
                                    Arraste e solte a imagem aqui, ou clique
                                    para selecionar
                                  </p>
                                </div>
                              </div>
                            )}
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex w-full justify-end gap-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-white hover:bg-red-500"
                      >
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      variant={'outline'}
                      className="hover:bg-green-500 hover:text-white"
                    >
                      {form.formState.isSubmitting ? (
                        <CircleNotch size={16} className="animate-spin" />
                      ) : (
                        'Salvar Alterações'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
