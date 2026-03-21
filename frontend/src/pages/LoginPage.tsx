import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeClosed, UserPlus, Loader2 } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validators'
import { LOGIN_MUTATION } from '@/graphql/mutations/auth.mutations'
import { useAuth } from '@/features/auth/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import logo from '@/assets/logo.svg'

export function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  interface LoginResult {
    login: { token: string; user: { id: string; name: string; email: string; createdAt: string } }
  }
  const [login] = useMutation<LoginResult>(LOGIN_MUTATION)

  const onSubmit = async (data: LoginInput) => {
    try {
      const { data: result } = await login({ variables: { input: data } })
      if (result?.login?.user) setUser(result.login.user)
      navigate('/dashboard')
    } catch (err) {
      setError('root', { message: 'Email ou senha inválidos' })
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="mb-6">
        <img src={logo} alt="Financy" height={32} />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Fazer login</h1>
          <p className="text-gray-500 text-sm mt-1">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="mail@exemplo.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-brand-base" />
              Lembrar-me
            </label>
            <button type="button" className="text-sm text-brand-base font-medium hover:underline">
              Recuperar senha
            </button>
          </div>

          {errors.root && (
            <p className="text-sm text-danger">{errors.root.message}</p>
          )}

          <Button
            type="submit"
            variant="filled"
            size="md"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-500 mb-3">Ainda não tem uma conta?</p>

        <Button
          type="button"
          variant="outlined"
          size="md"
          className="w-full border-gray-300 text-gray-800 hover:border-brand-base hover:text-brand-base hover:bg-transparent"
          onClick={() => navigate('/register')}
        >
          <UserPlus className="h-4 w-4" />
          Criar conta
        </Button>
      </div>
    </div>
  )
}
