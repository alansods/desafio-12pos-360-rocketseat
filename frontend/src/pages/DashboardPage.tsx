import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { Wallet, CircleArrowUp, CircleArrowDown, ChevronRight, Plus } from 'lucide-react'
import { SUMMARY_QUERY } from '@/graphql/queries/transaction.queries'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Tag } from '@/components/ui/tag'
import { CategoryIconBadge } from '@/lib/category-icons'
import TransactionDialog from '@/features/transactions/TransactionDialog'

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
}

interface CategoryBreakdown {
  category: Category
  count: number
  total: number
}

interface SummaryData {
  summary: {
    totalIncome: number
    totalExpense: number
    balance: number
    recentTransactions: Transaction[]
    categoryBreakdown: CategoryBreakdown[]
  }
}

export function DashboardPage() {
  const { data, loading } = useQuery<SummaryData>(SUMMARY_QUERY)
  const navigate = useNavigate()
  const [txDialogOpen, setTxDialogOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-base border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const summary = data?.summary

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-base flex items-center justify-center">
              <Wallet className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Saldo Total
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(summary?.balance ?? 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-success flex items-center justify-center">
              <CircleArrowUp className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Receitas do Mês
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(summary?.totalIncome ?? 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-danger flex items-center justify-center">
              <CircleArrowDown className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Despesas do Mês
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(summary?.totalExpense ?? 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Transações Recentes
            </span>
            <button
              onClick={() => navigate('/transactions')}
              className="flex items-center gap-1 text-xs font-medium text-brand-base hover:underline"
            >
              Ver todas <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {!summary?.recentTransactions.length ? (
            <p className="text-center text-gray-400 py-10 text-sm">
              Nenhuma transação ainda
            </p>
          ) : (
            <div className="divide-y divide-gray-200">
              {summary.recentTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <CategoryIconBadge icon={t.category.icon} color={t.category.color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{t.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
                  </div>
                  <Tag color={t.category.color} label={t.category.name} className="ml-8" />
                  <span className="text-sm font-semibold whitespace-nowrap text-gray-800 ml-4">
                    {t.type === 'INCOME' ? '+ ' : '- '}{formatCurrency(t.amount)}
                  </span>
                  {t.type === 'INCOME' ? (
                    <CircleArrowUp className="h-5 w-5 text-success shrink-0" />
                  ) : (
                    <CircleArrowDown className="h-5 w-5 text-danger shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setTxDialogOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-brand-base hover:bg-gray-50 border-t border-gray-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova transação
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden self-start">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Categorias
            </span>
            <button
              onClick={() => navigate('/categories')}
              className="flex items-center gap-1 text-xs font-medium text-brand-base hover:underline"
            >
              Gerenciar <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {!summary?.categoryBreakdown.length ? (
            <p className="text-center text-gray-400 py-10 text-sm">
              Nenhuma categoria ainda
            </p>
          ) : (
            <div className="flex flex-col gap-1 px-5 py-4">
              {summary.categoryBreakdown.slice(0, 6).map(({ category, count, total }) => (
                <div key={category.id} className="flex items-center py-1.5">
                  <Tag color={category.color} label={category.name} />
                  <span className="ml-auto text-xs text-gray-400 whitespace-nowrap pl-3 pr-6">
                    {count} {count === 1 ? 'item' : 'itens'}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 w-20 text-right whitespace-nowrap">
                    {formatCurrency(total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TransactionDialog open={txDialogOpen} onClose={() => setTxDialogOpen(false)} />
    </div>
  )
}
