import { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { CircleArrowDown, CircleArrowUp, Loader2 } from 'lucide-react'
import { transactionSchema, type TransactionInput } from '@/lib/validators'
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '@/graphql/mutations/transaction.mutations'
import { CATEGORIES_QUERY } from '@/graphql/queries/category.queries'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatDateInput } from '@/lib/utils'

interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface TransactionEditData {
  id: string
  title: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  date: string
  category: Category
}

interface TransactionDialogProps {
  open: boolean
  onClose: () => void
  editData?: TransactionEditData | null
}

export default function TransactionDialog({ open, onClose, editData }: TransactionDialogProps) {
  const [isEdit, setIsEdit] = useState(!!editData)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      amount: 0,
      type: 'EXPENSE',
      date: formatDateInput(new Date()),
      categoryId: '',
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const type = watch('type')
  const categoryId = watch('categoryId')

  useEffect(() => {
    if (open) {
      setIsEdit(!!editData)
      if (editData) {
        reset({
          title: editData.title,
          amount: editData.amount,
          type: editData.type,
          date: formatDateInput(editData.date),
          categoryId: editData.category.id,
        })
      } else {
        reset({
          title: '',
          amount: 0,
          type: 'EXPENSE',
          date: formatDateInput(new Date()),
          categoryId: '',
        })
      }
    }
  }, [open, editData, reset])

  const { data: catData } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY)
  const categories = catData?.categories ?? []

  const refetchQueries = ['Transactions', 'Summary']

  const [createTransaction] = useMutation(CREATE_TRANSACTION, { refetchQueries })
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, { refetchQueries })

  const onSubmit = async (data: TransactionInput) => {
    try {
      const input = {
        title: data.title,
        amount: data.amount,
        type: data.type,
        date: new Date(data.date).toISOString(),
        categoryId: data.categoryId,
      }
      if (isEdit && editData) {
        await updateTransaction({ variables: { id: editData.id, input } })
        toast({ title: 'Transação atualizada', description: `"${data.title}" foi atualizada com sucesso.`, variant: 'success' })
      } else {
        await createTransaction({ variables: { input } })
        toast({ title: 'Transação criada', description: `"${data.title}" foi criada com sucesso.`, variant: 'success' })
      }
      onClose()
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro ao salvar transação', description: 'Tente novamente.', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800">
            {isEdit ? 'Editar transação' : 'Nova transação'}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? 'Edite os dados da transação' : 'Registre sua despesa ou receita'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="flex gap-3 rounded-xl border border-gray-200 p-1.5">
            <button
              type="button"
              onClick={() => setValue('type', 'EXPENSE')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border transition-colors text-gray-800 ${
                type === 'EXPENSE'
                  ? 'border-danger bg-white'
                  : 'border-transparent text-gray-400 hover:border-danger hover:text-gray-800'
              }`}
            >
              <CircleArrowDown className={`h-4 w-4 ${type === 'EXPENSE' ? 'text-danger' : 'text-gray-400'}`} />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'INCOME')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border transition-colors text-gray-800 ${
                type === 'INCOME'
                  ? 'border-success bg-white'
                  : 'border-transparent text-gray-400 hover:border-success hover:text-gray-800'
              }`}
            >
              <CircleArrowUp className={`h-4 w-4 ${type === 'INCOME' ? 'text-success' : 'text-gray-400'}`} />
              Receita
            </button>
          </div>

          <Input
            label="Descrição"
            placeholder="Ex. Almoço no restaurante"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data"
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Valor</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className="w-full h-11 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
                  {...register('amount', { valueAsNumber: true })}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-danger">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <Select value={categoryId} onValueChange={(v) => setValue('categoryId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400">Nenhuma categoria criada</div>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-danger">{errors.categoryId.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="filled"
            size="md"
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
