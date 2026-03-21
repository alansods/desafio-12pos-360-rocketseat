import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { useApolloClient, useQuery, useMutation } from '@apollo/client/react'
import { ME_QUERY } from '@/graphql/queries/auth.queries'
import { LOGOUT_MUTATION } from '@/graphql/mutations/auth.mutations'

interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient()
  const [localUser, setLocalUser] = useState<User | null>(null)

  const { data: meData, loading } = useQuery<{ me: User }>(ME_QUERY)

  const user = meData?.me ?? localUser
  const setUser = (u: User | null) => setLocalUser(u)

  const [logoutMutation] = useMutation(LOGOUT_MUTATION)

  const logout = async () => {
    await logoutMutation()
    await client.clearStore()
    setLocalUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
