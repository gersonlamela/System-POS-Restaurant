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
import { CircleNotch, Pencil, Trash } from '@phosphor-icons/react'
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
import { Ingredient, Product } from '@prisma/client'

const FormSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório.'),
  price: z.number().positive('O preço deve ser um valor positivo.'),
  image: z.any(),
})

interface EditIngredientModalProps {
  ingredient: Ingredient
}

export default function EditIngredientModal({
  ingredient,
}: EditIngredientModalProps) {
  const [file, setFile] = useState<File>()
  const [imagePreview, setImagePreview] = useState<string>(
    `/uploads/ingredients/${ingredient.image}`,
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: ingredient.name,
      price: ingredient.price,
      image: ingredient.image,
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

      const response = await fetch(
        `/api/ingredient/editIngredient?id=${ingredient.id}`,
        {
          method: 'PUT',
          body: formData,
        },
      )

      const data = await response.json()
      if (response.ok) {
        location.href = '/dashboard/ingredients'
        // Atualização bem-sucedida, você pode redirecionar ou fazer outra coisa
        toast.success('Ingrediente atualizado com sucesso!')
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
              Editar Ingrediente
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
