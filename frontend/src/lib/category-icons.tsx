import {
  Briefcase,
  Car,
  Heart,
  PiggyBank,
  ShoppingCart,
  ArrowLeftRight,
  Gift,
  Utensils,
  MapPin,
  Home,
  Package,
  Wrench,
  BookOpen,
  Monitor,
  Wallet,
  FileText,
  Tag,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const CATEGORY_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: 'briefcase', icon: Briefcase },
  { name: 'car', icon: Car },
  { name: 'heart', icon: Heart },
  { name: 'piggy-bank', icon: PiggyBank },
  { name: 'shopping-cart', icon: ShoppingCart },
  { name: 'arrow-left-right', icon: ArrowLeftRight },
  { name: 'gift', icon: Gift },
  { name: 'utensils', icon: Utensils },
  { name: 'map-pin', icon: MapPin },
  { name: 'home', icon: Home },
  { name: 'package', icon: Package },
  { name: 'wrench', icon: Wrench },
  { name: 'book-open', icon: BookOpen },
  { name: 'monitor', icon: Monitor },
  { name: 'wallet', icon: Wallet },
  { name: 'file-text', icon: FileText },
]

const iconMap = new Map(CATEGORY_ICONS.map((i) => [i.name, i.icon]))

export function getCategoryIcon(name: string): LucideIcon {
  return iconMap.get(name) ?? Tag
}

type ColorKey = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'yellow' | 'pink'

const iconBgMap: Record<ColorKey, string> = {
  blue: 'bg-blue-light text-blue-base',
  green: 'bg-green-light text-green-base',
  purple: 'bg-purple-light text-purple-base',
  red: 'bg-red-light text-red-base',
  orange: 'bg-orange-light text-orange-base',
  yellow: 'bg-yellow-light text-yellow-base',
  pink: 'bg-pink-light text-pink-base',
}

const solidColorMap: Record<ColorKey, string> = {
  blue: 'bg-blue-base',
  green: 'bg-green-base',
  purple: 'bg-purple-base',
  red: 'bg-red-base',
  orange: 'bg-orange-base',
  yellow: 'bg-yellow-base',
  pink: 'bg-pink-base',
}

export function getCategoryIconBg(color: string): string {
  return iconBgMap[color as ColorKey] ?? 'bg-gray-200 text-gray-600'
}

export function getCategorySolidBg(color: string): string {
  return solidColorMap[color as ColorKey] ?? 'bg-gray-400'
}

interface CategoryIconBadgeProps {
  icon: string
  color: string
  size?: 'sm' | 'md'
  className?: string
}

export function CategoryIconBadge({ icon, color, size = 'md', className }: CategoryIconBadgeProps) {
  const Icon = getCategoryIcon(icon)
  const bgClass = getCategoryIconBg(color)
  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-lg flex-shrink-0',
        sizeClass,
        bgClass,
        className,
      )}
    >
      <Icon className={iconSize} />
    </span>
  )
}
