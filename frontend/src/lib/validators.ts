import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  color: z.enum(['blue', 'green', 'purple', 'red', 'orange', 'yellow', 'pink'] as const, {
    error: 'Selecione uma cor',
  }),
  icon: z.string().optional(),
  description: z.string().optional(),
})

export const transactionSchema = z.object({
  title: z.string().min(1, 'Descrição obrigatória'),
  amount: z.number({ error: 'Valor deve ser um número' }).positive('Valor deve ser positivo'),
  type: z.enum(['INCOME', 'EXPENSE'] as const, {
    error: 'Selecione o tipo',
  }),
  date: z.string().min(1, 'Data obrigatória'),
  categoryId: z.string().min(1, 'Categoria obrigatória'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type TransactionInput = z.infer<typeof transactionSchema>
