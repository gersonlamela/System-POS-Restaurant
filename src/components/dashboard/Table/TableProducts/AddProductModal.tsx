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
import { Plus } from '@phosphor-icons/react'
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
import image from 'next/image'

const ProductCategoryEnum = z.enum(['DRINK', 'FOOD', 'DESSERT'])
const TaxEnum = z.enum(['REDUCED', 'INTERMEDIATE', 'STANDARD'])

const FormSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório.'),
  price: z.number().positive('O preço deve ser um valor positivo.'),
  image: z.string().optional(),
  tax: TaxEnum,
  discount: z.number().optional(),
  category: ProductCategoryEnum,
})

export default function AddProductModal() {
  const { handleSubmit, formState } = useForm()
  const [file, setFile] = useState<File>()
  const [imagePreview, setImagePreview] = useState<string>('')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      price: 0.0,
      tax: 'INTERMEDIATE',
      image: '',
      discount: 0,
      category: 'FOOD',
    },
  })

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log(values)
    if (!file) return
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Add other fields to the FormData as needed
      formData.append('name', values.name)
      formData.append('price', values.price.toString())
      formData.append('tax', values.tax)
      if (values.discount) {
        formData.append('discount', values.discount.toString())
      }
      formData.append('category', values.category)

      const response = await fetch('/api/product/createProduct', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        location.href = '/'
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
                  <div className="mt-2 grid w-full grid-cols-2 items-start gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Imagem</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...field}
                              accept=".svg, .png, .jpg, .jpeg"
                              onChange={handleFileChange}
                            />
                          </FormControl>
                          <FormMessage className="absolute text-red-500" />
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{ maxWidth: '100%', marginTop: '10px' }}
                            />
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="price"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Preço</FormLabel>
                          <FormControl>
                            <Input
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
                          <FormLabel className="text-black">Desconto</FormLabel>
                          <FormControl>
                            <Input
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
                          <FormLabel className="text-black">Imposto</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded border p-2"
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
                          <FormLabel className="text-black">
                            Categoria
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded border p-2"
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
                  </div>
                  <div className="flex w-full justify-end gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      variant={'outline'}
                    >
                      {form.formState.isSubmitting ? (
                        <span className="spinner-border spinner-border-sm mr-1"></span>
                      ) : (
                        <span>Criar Produto</span>
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
