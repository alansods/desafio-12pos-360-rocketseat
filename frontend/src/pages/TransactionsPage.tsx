import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { Search, Plus, Trash, SquarePen, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { TRANSACTIONS_QUERY } from '@/graphql/queries/transaction.queries'
import { CATEGORIES_QUERY } from '@/graphql/queries/category.queries'
import { DELETE_TRANSACTION } from '@/graphql/mutations/transaction.mutations'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Tag } from '@/components/ui/tag'
import { TypeIndicator } from '@/components/ui/type-indicator'
import { Button } from '@/components/ui/button'
import { CategoryIconBadge } from '@/lib/category-icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import TransactionDialog, { type TransactionEditData } from '@/features/transactions/TransactionDialog'

interface Category {
  id: string
  name: string
  color: string
  icon: string
}

interface Transaction {
  id: string
  title: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  date: string
  category: Category
  createdAt: string
  updatedAt: string
}

interface TransactionPage {
  items: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const PAGE_SIZE = 10

function getMonthOptions() {
  const options: { label: string; value: string; start: string; end: string }[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase())
    const start = new Date(year, month, 1).toISOString()
    const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString()
    options.push({ label, value: `${year}-${month}`, start, end })
  }
  return options
}

export function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterCategoryId, setFilterCategoryId] = useState('')
  const [filterPeriod, setFilterPeriod] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<TransactionEditData | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const monthOptions = useMemo(() => getMonthOptions(), [])

  const selectedPeriod = monthOptions.find((o) => o.value === filterPeriod)

  const { data, loading } = useQuery<{ transactions: TransactionPage }>(TRANSACTIONS_QUERY, {
    variables: {
      page,
      pageSize: PAGE_SIZE,
      type: filterType || undefined,
      categoryId: filterCategoryId || undefined,
      search: debouncedSearch || undefined,
      startDate: selectedPeriod?.start ?? undefined,
      endDate: selectedPeriod?.end ?? undefined,
    },
  })

  const { data: catData } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY)
  const [deleteTx, { loading: deleting }] = useMutation(DELETE_TRANSACTION, { refetchQueries: ['Transactions', 'Summary'] })

  const txPage = data?.transactions
  const categories = catData?.categories ?? []

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setSearch(v)
    setPage(1)
    clearTimeout((window as unknown as { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer)
    ;(window as unknown as { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer = setTimeout(() => {
      setDebouncedSearch(v)
    }, 300)
  }

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v === 'all' ? '' : v)
    setPage(1)
  }

  const handleDelete = (id: string, name: string) => setDeleteTarget({ id, name })

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteTx({ variables: { id: deleteTarget.id } })
      setDeleteTarget(null)
    }
  }

  const handleEdit = (tx: Transaction) => {
    setEditing(tx as TransactionEditData)
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false)
    setEditing(null)
  }

  const start = txPage ? (txPage.page - 1) * txPage.pageSize + 1 : 0
  const end = txPage ? Math.min(txPage.page * txPage.pageSize, txPage.total) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button
          variant="filled"
          size="md"
          onClick={() => { setEditing(null); setDialogOpen(true) }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova transação
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Buscar</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search className="h-4 w-4" />
              </span>
              <input
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar por descrição"
                className="w-full h-10 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Tipo</label>
            <Select onValueChange={handleFilterChange(setFilterType)} value={filterType || 'all'}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="INCOME">Entrada</SelectItem>
                <SelectItem value="EXPENSE">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <Select onValueChange={handleFilterChange(setFilterCategoryId)} value={filterCategoryId || 'all'}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Período</label>
            <Select
              onValueChange={handleFilterChange(setFilterPeriod)}
              value={filterPeriod || 'all'}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                {monthOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-brand-base border-t-transparent rounded-full animate-spin" />
          </div>
        ) : txPage?.items.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">Nenhuma transação encontrada</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Descrição
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Data
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Categoria
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Tipo
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Valor
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {txPage?.items.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <CategoryIconBadge icon={tx.category.icon} color={tx.category.color} size="sm" />
                        <span className="font-medium text-gray-800">{tx.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{formatDate(tx.date)}</td>
                    <td className="px-5 py-3.5">
                      <Tag color={tx.category.color} label={tx.category.name} />
                    </td>
                    <td className="px-5 py-3.5">
                      <TypeIndicator type={tx.type} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-800">
                      {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleDelete(tx.id, tx.title)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-red-400 hover:text-red-600 hover:border-red-400 transition-colors"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(tx)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:text-brand-base hover:border-brand-base transition-colors"
                        >
                          <SquarePen className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {txPage && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {txPage.total > 0 ? `${start} a ${end} | ${txPage.total} resultados` : '0 resultados'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: txPage.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-brand-base text-white'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === txPage.totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <TransactionDialog open={dialogOpen} onClose={handleClose} editData={editing} />

      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir transação</DialogTitle>
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
