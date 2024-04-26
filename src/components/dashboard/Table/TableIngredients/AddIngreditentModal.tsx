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

const FormSchema = z.object({
  name: z.string().min(1, 'O nome do ingrediente é obrigatório.'),
  price: z.number().positive('O preço deve ser um valor positivo.'),
  image: z.any(),
})

export default function AddIngredientModal() {
  const [file, setFile] = useState<File>()
  const [imagePreview, setImagePreview] = useState<string>('')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      price: 0.0,
      image: '',
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

      const response = await fetch('/api/ingredient/createIngredient', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        location.href = '/dashboard/ingredients'
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
          Adicionar Ingrediente
        </DialogTrigger>
        <DialogContent className="min-w-[630px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Adicionar Ingrediente
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
                      control={form.control}
                      name="image"
                      render={({ field }) => (
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
                                  alt="Preview"
                                  className=" h-[150px] w-[150px] object-cover "
                                  style={{ maxHeight: '200px' }} // opcional: definindo uma altura máxima
                                />
                                <button
                                  className="absolute right-0 top-0 rounded-full p-2 text-white transition duration-300 hover:text-red-600"
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
                                className={`relative my-4 flex h-[200px] max-w-full   flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 ${form.formState.errors.image ? 'border-red-500' : ''}`}
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

                  <div className="flex w-full justify-end gap-2">
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
                        <Button
                          className="  "
                          onClick={() => console.log(form.getValues())}
                        >
                          Criar Ingrediente
                        </Button>
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
