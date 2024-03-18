import React, { useState } from 'react'
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
import { Pencil, Trash } from '@phosphor-icons/react'
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
import { Product } from '@prisma/client'
import { getCategoryDirectory } from '@/functions/Product/product'

const ProductCategoryEnum = z.enum(['DRINK', 'FOOD', 'DESSERT'])
const TaxEnum = z.enum(['REDUCED', 'INTERMEDIATE', 'STANDARD'])

const FormSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório.'),
  price: z.number().positive('O preço deve ser um valor positivo.'),
  image: z.any(),
  tax: TaxEnum,
  discount: z.number().optional(),
  category: ProductCategoryEnum,
})

interface EditProductModalProps {
  product: Product
}

export default function EditProductModal({ product }: EditProductModalProps) {
  const [file, setFile] = useState<File>()
  const [imagePreview, setImagePreview] = useState<string>(
    `/uploads/${getCategoryDirectory(product.category)}/${product.image}`,
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      image: product.image,
      tax: product.tax,
      discount: product.discount || 0,
      category: product.category,
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

      const response = await fetch(
        `/api/product/editProduct?id=${product.id}`,
        {
          method: 'PUT',
          body: formData,
        },
      )

      const data = await response.json()
      if (response.ok) {
        location.href = '/dashboard/products'
        // Atualização bem-sucedida, você pode redirecionar ou fazer outra coisa
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
          <Pencil size={16} weight="bold" />
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
                  <div className="mt-2 grid w-full grid-cols-2 items-start gap-6">
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
                              placeholder="johndoe"
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
                              <option value="DRINK">Bebidas</option>
                              <option value="FOOD">Comida</option>
                              <option value="DESSERT">Sobremesa</option>
                            </select>
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
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
                                  className="absolute right-0 top-0 rounded-full p-1 text-red-500 transition duration-300 hover:text-red-600"
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
                        <span className="spinner-border spinner-border-sm mr-1"></span>
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
