import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import { registerSchema, type RegisterInput } from '@/lib/validators'
import { REGISTER_MUTATION } from '@/graphql/mutations/auth.mutations'
import { useAuth } from '@/features/auth/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import logo from '@/assets/logo.svg'

export function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  interface RegisterResult {
    register: { token: string; user: { id: string; name: string; email: string; createdAt: string } }
  }
  const [registerMutation] = useMutation<RegisterResult>(REGISTER_MUTATION)

  const onSubmit = async (data: RegisterInput) => {
    try {
      const { data: result } = await registerMutation({
        variables: { input: { name: data.name, email: data.email, password: data.password } },
      })
      if (result?.register?.user) setUser(result.register.user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta'
      setError('root', { message })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="mb-6">
        <img src={logo} alt="Financy" height={32} />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Criar conta</h1>
          <p className="text-gray-500 text-sm mt-1">Comece a controlar suas finanças ainda hoje</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome completo"
            type="text"
            placeholder="Seu nome completo"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="mail@exemplo.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
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
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />
            {!errors.password && (
              <p className="text-xs text-gray-400 mt-1">A senha deve ter no mínimo 8 caracteres</p>
            )}
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
            {isSubmitting ? 'Criando...' : 'Cadastrar'}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-500 mb-3">Já tem uma conta?</p>

        <Button
          type="button"
          variant="outlined"
          size="md"
          className="w-full border-gray-300 text-gray-800 hover:border-brand-base hover:text-brand-base hover:bg-transparent"
          onClick={() => navigate('/')}
        >
          <LogIn className="h-4 w-4" />
          Fazer login
        </Button>
      </div>
    </div>
  )
}
