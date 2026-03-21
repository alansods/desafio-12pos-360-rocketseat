import { useState, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { useQuery, useMutation } from '@apollo/client/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash, SquarePen, Tag as TagIcon, ArrowUpDown, Loader2 } from 'lucide-react'
import { CATEGORIES_QUERY } from '@/graphql/queries/category.queries'
import { SUMMARY_QUERY } from '@/graphql/queries/transaction.queries'
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '@/graphql/mutations/category.mutations'
import { categorySchema, type CategoryInput } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tag } from '@/components/ui/tag'
import { CategoryIconBadge, CATEGORY_ICONS, getCategoryIcon, getCategoryIconBg } from '@/lib/category-icons'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface Category {
  id: string
  name: string
  color: string
  icon: string
  description: string
}

interface CategoryBreakdown {
  category: { id: string; name: string; color: string }
  count: number
}

interface SummaryData {
  summary: {
    categoryBreakdown: CategoryBreakdown[]
  }
}

const COLORS = [
  { value: 'green', hex: '#1F6F43' },
  { value: 'blue', hex: '#2563EB' },
  { value: 'purple', hex: '#9333EA' },
  { value: 'pink', hex: '#DB2777' },
  { value: 'red', hex: '#DC2626' },
  { value: 'orange', hex: '#EA580C' },
  { value: 'yellow', hex: '#CA8A04' },
] as const

function CategoryDialog({
  open,
  onClose,
  initial,
}: {
  open: boolean
  onClose: () => void
  initial?: Category
}) {
  const [isEdit, setIsEdit] = useState(!!initial)
  useEffect(() => {
    if (open) setIsEdit(!!initial)
  }, [open, initial])
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initial
      ? { name: initial.name, color: initial.color as CategoryInput['color'], icon: initial.icon, description: initial.description }
      : { name: '', color: 'green', icon: 'briefcase', description: '' },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedColor = watch('color')
  const selectedIcon = watch('icon')

  const [createCategory] = useMutation(CREATE_CATEGORY, { refetchQueries: ['Categories', 'Summary'] })
  const [updateCategory] = useMutation(UPDATE_CATEGORY, { refetchQueries: ['Categories', 'Summary'] })

  const handleClose = () => {
    setFormError(null)
    reset({ name: '', color: 'green', icon: 'briefcase', description: '' })
    onClose()
  }

  const onSubmit = async (data: CategoryInput) => {
    try {
      setFormError(null)
      if (isEdit) {
        await updateCategory({ variables: { id: initial!.id, input: data } })
        toast({ title: 'Categoria atualizada', description: `"${data.name}" foi atualizada com sucesso.`, variant: 'success' })
      } else {
        await createCategory({ variables: { input: data } })
        toast({ title: 'Categoria criada', description: `"${data.name}" foi criada com sucesso.`, variant: 'success' })
      }
      handleClose()
    } catch (err: unknown) {
      const message = (err as { graphQLErrors?: { message: string }[] })?.graphQLErrors?.[0]?.message
      setFormError(message ?? 'Erro ao salvar categoria')
      toast({ title: 'Erro ao salvar categoria', description: message ?? 'Tente novamente.', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800">
            {isEdit ? 'Editar categoria' : 'Nova categoria'}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-0.5">
            Organize suas transações com categorias
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Título"
            placeholder="Ex. Alimentação"
            error={errors.name?.message ?? formError ?? undefined}
            {...register('name', { onChange: () => setFormError(null) })}
          />

          <div className="flex flex-col gap-1.5">
            <Input
              label="Descrição"
              placeholder="Descrição da categoria"
              {...register('description')}
            />
            <p className="text-xs text-gray-400">Opcional</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Ícone</label>
            <div className="grid grid-cols-8 gap-2">
              {CATEGORY_ICONS.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setValue('icon', name)}
                  className={cn(
                    'h-9 w-full flex items-center justify-center rounded-lg border transition-all text-gray-500 hover:border-brand-base',
                    selectedIcon === name
                      ? 'border-brand-base bg-white'
                      : 'border-gray-200 bg-white',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Cor</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setValue('color', c.value)}
                  onMouseEnter={() => setHoveredColor(c.value)}
                  onMouseLeave={() => setHoveredColor(null)}
                  style={{
                    borderColor: (selectedColor === c.value || hoveredColor === c.value) ? c.hex : undefined,
                  }}
                  className="w-12.5 h-7.5 rounded-lg border border-gray-200 p-1.25 transition-all"
                >
                  <div className="w-full h-full rounded" style={{ backgroundColor: c.hex }} />
                </button>
              ))}
            </div>
            {errors.color && <p className="text-xs text-danger">{errors.color.message}</p>}
          </div>

          <Button
            type="submit"
            variant="filled"
            size="md"
            className="w-full mt-1"
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

export function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const { data, loading } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY)
  const { data: summaryData } = useQuery<SummaryData>(SUMMARY_QUERY)

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY, { refetchQueries: ['Categories', 'Summary'] })

  const categories = data?.categories ?? []
  const breakdown = summaryData?.summary?.categoryBreakdown ?? []

  const countMap = new Map(breakdown.map((b) => [b.category.id, b.count]))
  const totalTransactions = breakdown.reduce((sum, b) => sum + b.count, 0)
  const mostUsed = breakdown.reduce(
    (max, b) => (b.count > (max?.count ?? -1) ? b : max),
    null as CategoryBreakdown | null,
  )

  const handleDelete = (id: string, name: string) => setDeleteTarget({ id, name })

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteCategory({ variables: { id: deleteTarget.id } })
      toast({ title: 'Categoria excluída', description: `"${deleteTarget.name}" foi excluída com sucesso.`, variant: 'destructive' })
      setDeleteTarget(null)
    }
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false)
    setEditing(undefined)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-4 border-brand-base border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-sm text-gray-500 mt-0.5">Organize suas transações por categorias</p>
        </div>
        <Button
          variant="filled"
          size="md"
          onClick={() => { setEditing(undefined); setDialogOpen(true) }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 flex items-center justify-center shrink-0 text-purple-base">
              <TagIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
                Total de Categorias
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 flex items-center justify-center shrink-0 text-blue-base">
              <ArrowUpDown className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalTransactions}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
                Total de Transações
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          {mostUsed ? (
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = getCategoryIcon(categories.find((c) => c.id === mostUsed.category.id)?.icon ?? 'tag')
                const colorClass = getCategoryIconBg(mostUsed.category.color).split(' ').find((c: string) => c.startsWith('text-')) ?? 'text-gray-500'
                return (
                  <span className={`w-10 h-10 flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                )
              })()}
              <div>
                <p className="text-xl font-bold text-gray-800 leading-tight">{mostUsed.category.name}</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
                  Categoria Mais Utilizada
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 flex items-center justify-center shrink-0 text-gray-400">
                <TagIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-bold text-gray-400">—</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
                  Categoria Mais Utilizada
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">Nenhuma categoria criada ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = countMap.get(cat.id) ?? 0
            return (
              <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <CategoryIconBadge icon={cat.icon} color={cat.color} size="md" />
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-red-400 hover:text-red-600 hover:border-red-400 transition-colors"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleEdit(cat)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:text-brand-base hover:border-brand-base transition-colors"
                    >
                      <SquarePen className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-base font-bold text-gray-800">{cat.name}</p>
                  {cat.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Tag color={cat.color} label={cat.name} />
                  <span className="text-xs text-gray-400 font-medium">
                    {count} {count === 1 ? 'item' : 'itens'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CategoryDialog open={dialogOpen} onClose={handleClose} initial={editing} />

      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir categoria</DialogTitle>
            <p className="text-sm text-gray-500 mt-0.5">Tem certeza que deseja excluir <span className="font-semibold text-gray-800">"{deleteTarget?.name}"</span>?</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" size="md" onClick={() => setDeleteTarget(null)} className="border border-transparent text-gray-800 hover:border-gray-200 hover:bg-transparent hover:text-gray-800">
              Cancelar
            </Button>
            <Button variant="destructive" size="md" onClick={confirmDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
