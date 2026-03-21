import { cn } from '@/lib/utils'

type TagColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'yellow' | 'pink'

const colorMap: Record<TagColor, string> = {
  blue: 'bg-blue-light text-blue-dark',
  green: 'bg-green-light text-green-dark',
  purple: 'bg-purple-light text-purple-dark',
  red: 'bg-red-light text-red-dark',
  orange: 'bg-orange-light text-orange-dark',
  yellow: 'bg-yellow-light text-yellow-dark',
  pink: 'bg-pink-light text-pink-dark',
}

interface TagProps {
  color: string
  label: string
  className?: string
}

export function Tag({ color, label, className }: TagProps) {
  const colorClass = colorMap[color as TagColor] ?? 'bg-gray-200 text-gray-700'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        colorClass,
        className,
      )}
    >
      {label}
    </span>
  )
}
