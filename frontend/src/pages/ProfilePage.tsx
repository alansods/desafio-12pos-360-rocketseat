import { useState } from 'react'
import { LogOut, User, Mail, Loader2 } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation } from '@apollo/client/react'
import { UPDATE_PROFILE_MUTATION } from '@/graphql/mutations/auth.mutations'
import { ME_QUERY } from '@/graphql/queries/auth.queries'

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [name, setName] = useState(user?.name ?? '')

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const handleSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    await updateProfile({ variables: { input: { name } } })
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 mb-3">
            {user ? getInitials(user.name) : '?'}
          </div>
          <p className="text-lg font-bold text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <hr className="border-gray-100 mb-6" />

        <form onSubmit={handleSave}>
          <div className="space-y-4 mb-8">
            <Input
              label="Nome completo"
              leftIcon={<User className="h-4 w-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div>
              <Input
                label="E-mail"
                leftIcon={<Mail className="h-4 w-4" />}
                value={user?.email ?? ''}
                disabled
                readOnly
              />
              <p className="text-xs text-gray-400 mt-1">O e-mail não pode ser alterado</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button type="submit" variant="filled" size="md" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </Button>

            <Button
              type="button"
              variant="outlined"
              size="md"
              className="w-full flex items-center justify-center gap-2 text-gray-800 border-gray-200 hover:border-red-500 hover:bg-transparent hover:text-gray-800"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 text-red-500" />
              Sair da conta
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
