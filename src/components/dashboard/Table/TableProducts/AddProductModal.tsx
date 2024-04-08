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
import { CircleNotch, Plus, Trash } from '@phosphor-icons/react'
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

import { handleGetProductsCategory } from '@/functions/Product/product'

const TaxEnum = z.enum(['REDUCED', 'INTERMEDIATE', 'STANDARD'])

const FormSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório.'),
  price: z.number().positive('O preço deve ser um valor positivo.'),
  image: z.any(),
  tax: TaxEnum,
  ingredients: z.any(),
  discount: z.number().optional(),
  stock: z.number().optional(),
  category: z.string(),
})
type SelectedIngredient = {
  id: string
  quantity: number
}

export default function AddProductModal() {
  const [file, setFile] = useState<File>()
  const [ingredients, setIngredients] = useState<Ingredient[]>()
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([])
  const [searchValue, setSearchValue] = useState('')
  const [category, setCategory] = useState<ProductCategory[]>([])

  useEffect(() => {
    handleGetIngredients().then((data) => {
      setIngredients(data)
    })
  }, [])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      price: 0.0,
      tax: 'INTERMEDIATE',
      stock: 0,
      ingredients: selectedIngredients,
      image: '',
      discount: 0,
      category: '',
    },
  })

  useEffect(() => {
    handleGetProductsCategory().then((data) => {
      setCategory(data)
    })
  }, [])

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log(values)
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Adicione outros campos ao FormData conforme necessário
      formData.append('name', values.name)
      formData.append('price', values.price.toString())
      formData.append('tax', values.tax)
      if (values.discount) {
        formData.append('discount', values.discount.toString())
      }
      if (values.stock) {
        formData.append('stock', values.stock.toString())
      }
      formData.append('category', values.category)

      // Adicione os ingredientes selecionados ao FormData
      formData.append('ingredients', JSON.stringify(selectedIngredients))

      const response = await fetch('/api/product/createProduct', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        location.href = '/dashboard/products'
      }

      toast.error(data.message)
    } catch (error) {
      console.log('There was an error', error)
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

  const { reset } = form
  return (
    <>
      <Dialog>
        <DialogTrigger
          className="flex flex-row items-center gap-2 rounded-lg bg-black px-2 py-2 text-white"
          onClick={() => {
            reset()
          }}
        >
          <Plus size={16} weight="bold" />
          Adicionar Produto
        </DialogTrigger>
        <DialogContent className="min-w-[630px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Adicionar Produto
            </DialogTitle>
            <hr />
            <DialogDescription className=" w-full ">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  <div className="mt-2 grid grid-cols-2 gap-6">
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
                              placeholder="johndoe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="price"
                      control={form.control}
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
                      name="discount"
                      control={form.control}
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
                          <FormControl>
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
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ingredients"
                      render={({ field }) => (
                        <div className="relative ">
                          <label className="block font-medium text-black">
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

                          <div className="absolute left-0 top-full z-10 mt-1 grid max-h-[250px] w-full grid-cols-2 overflow-auto rounded-md bg-gray-100">
                            {ingredients ? (
                              ingredients
                                .filter((ingredient) =>
                                  ingredient.name
                                    .toLowerCase()
                                    .includes(searchValue),
                                )
                                .map((ingredient) => (
                                  <label
                                    key={ingredient.id}
                                    className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
                                  >
                                    <Input
                                      className="mr-2 h-4 w-4"
                                      type="checkbox"
                                      name={ingredient.name}
                                      value={ingredient.id}
                                      checked={selectedIngredients.some(
                                        (selected) =>
                                          selected.id === ingredient.id,
                                      )}
                                      onChange={(e) => {
                                        const isChecked = e.target.checked
                                        const ingredientId = ingredient.id
                                        const ingredientQuantity = parseInt(
                                          prompt('Enter the quantity') || '0',
                                        )
                                        const updatedIngredients = isChecked
                                          ? [
                                              ...selectedIngredients,
                                              {
                                                id: ingredientId,
                                                quantity: ingredientQuantity,
                                              },
                                            ]
                                          : selectedIngredients.filter(
                                              (selected) =>
                                                selected.id !== ingredientId,
                                            )
                                        setSelectedIngredients(
                                          updatedIngredients,
                                        )
                                        field.onChange(updatedIngredients)
                                      }}
                                    />
                                    <span className="text-sm">
                                      {ingredient.name}
                                    </span>
                                    {/* Campo de entrada para quantidade */}
                                    <Input
                                      type="number"
                                      min="0"
                                      value={
                                        selectedIngredients.find(
                                          (selected) =>
                                            selected.id === ingredient.id,
                                        )?.quantity
                                      }
                                      onChange={(e) => {
                                        const updatedQuantity =
                                          parseInt(e.target.value) || 0
                                        const updatedIngredients =
                                          selectedIngredients.map((selected) =>
                                            selected.id === ingredient.id
                                              ? {
                                                  ...selected,
                                                  quantity: updatedQuantity,
                                                }
                                              : selected,
                                          )
                                        setSelectedIngredients(
                                          updatedIngredients,
                                        )
                                        field.onChange(updatedIngredients)
                                      }}
                                    />
                                  </label>
                                ))
                            ) : (
                              <div>Sem Ingredientes</div>
                            )}
                          </div>
                        </div>
                      )}
                    />
                    <FormField
                      name="stock"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-black">
                            Quantidade
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
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem className="relative mt-6">
                          <FormLabel className="mt-4 font-medium text-black">
                            Imagem
                          </FormLabel>
                          <FormMessage className="absolute text-red-500" />
                          <FormControl className="">
                            {imagePreview ? (
                              <div className="relative my-4 flex h-[200px] w-[200px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 text-center">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className=" h-[150px] w-[150px] object-cover "
                                  style={{ maxHeight: '200px' }} // opcional: definindo uma altura máxima
                                />
                                <button
                                  className="absolute right-0 top-0 rounded-full p-1 text-red-500 transition duration-300 hover:text-red-600"
                                  onClick={() => {
                                    setImagePreview('')
                                    setFile(undefined)
                                  }}
                                >
                                  <Trash size={20} weight="bold" />
                                </button>
                              </div>
                            ) : (
                              <div
                                className={` my-4 flex h-[200px] max-w-full   flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 ${form.formState.errors.image ? 'border-red-500' : ''}`}
                              >
                                <input
                                  type="file"
                                  required
                                  {...field}
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

                  <div className="mt-4 flex w-full justify-end gap-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-white hover:bg-red-500 "
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
                        'Criar Produto'
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
