import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { cn } from '@/lib/utils'
import logo from '@/assets/logo.svg'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transactions', label: 'Transações' },
  { to: '/categories', label: 'Categorias' },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b border-gray-200 shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <NavLink to="/dashboard">
          <img src={logo} alt="Financy" height={24} />
        </NavLink>

        <nav className="flex items-center gap-6">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors',
                  isActive ? 'text-brand-base' : 'text-gray-500 hover:text-gray-800',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 hover:bg-gray-400 transition-colors"
        >
          {user ? getInitials(user.name) : '?'}
        </button>
      </div>
    </header>
  )
}
