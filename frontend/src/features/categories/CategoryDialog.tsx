import { useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client/react'
import { categorySchema, type CategoryInput } from '@/lib/validators'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/graphql/mutations/category.mutations'
import { CATEGORIES_QUERY } from '@/graphql/queries/category.queries'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Azul', bg: 'bg-blue-base' },
  { value: 'green', label: 'Verde', bg: 'bg-green-base' },
  { value: 'purple', label: 'Roxo', bg: 'bg-purple-base' },
  { value: 'red', label: 'Vermelho', bg: 'bg-red-base' },
  { value: 'orange', label: 'Laranja', bg: 'bg-orange-base' },
  { value: 'yellow', label: 'Amarelo', bg: 'bg-yellow-base' },
  { value: 'pink', label: 'Rosa', bg: 'bg-pink-base' },
] as const

interface Category {
  id: string
  name: string
  color: string
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  editData?: Category | null
}

export function CategoryDialog({ open, onOpenChange, editData }: CategoryDialogProps) {
  const isEdit = !!editData

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', color: 'blue' },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedColor = watch('color')

  useEffect(() => {
    if (editData) {
      reset({ name: editData.name, color: editData.color as CategoryInput['color'] })
    } else {
      reset({ name: '', color: 'blue' })
    }
  }, [editData, reset])

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [CATEGORIES_QUERY],
  })

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [CATEGORIES_QUERY],
  })

  const onSubmit = async (data: CategoryInput) => {
    try {
      if (isEdit && editData) {
        await updateCategory({ variables: { id: editData.id, input: data } })
        toast({ title: 'Categoria atualizada', description: `"${data.name}" foi atualizada com sucesso.`, variant: 'success' })
      } else {
        await createCategory({ variables: { input: data } })
        toast({ title: 'Categoria criada', description: `"${data.name}" foi criada com sucesso.`, variant: 'success' })
      }
      onOpenChange(false)
      reset()
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro ao salvar categoria', description: 'Tente novamente.', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome"
            placeholder="Ex: Alimentação"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Cor</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setValue('color', c.value)}
                  className={`w-8 h-8 rounded-full ${c.bg} transition-all ${
                    selectedColor === c.value
                      ? 'ring-2 ring-offset-2 ring-gray-800 scale-110'
                      : 'hover:scale-110'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
            {errors.color && (
              <p className="text-xs text-danger">{errors.color.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outlined"
              size="md"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="filled" size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
