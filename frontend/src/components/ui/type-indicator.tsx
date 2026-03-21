import { CircleArrowUp, CircleArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TypeIndicatorProps {
  type: 'INCOME' | 'EXPENSE'
  className?: string
}

export function TypeIndicator({ type, className }: TypeIndicatorProps) {
  const isIncome = type === 'INCOME'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-medium',
        isIncome ? 'text-success' : 'text-danger',
        className,
      )}
    >
      {isIncome ? (
        <CircleArrowUp className="h-4 w-4" />
      ) : (
        <CircleArrowDown className="h-4 w-4" />
      )}
      {isIncome ? 'Entrada' : 'Saída'}
    </span>
  )
}
