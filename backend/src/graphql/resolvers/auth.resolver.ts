import { GraphQLError } from 'graphql'
import { Context, requireAuth } from '../context'
import { hashPassword, comparePassword } from '../../lib/password'
import { signToken } from '../../lib/jwt'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

export const authResolver = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: Context) => {
      const userId = requireAuth(ctx)
      const user = await ctx.prisma.user.findUnique({ where: { id: userId } })
      if (!user) throw new GraphQLError('User not found')
      return user
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      { input }: { input: { name: string; email: string; password: string } },
      ctx: Context,
    ) => {
      const existing = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      })
      if (existing) {
        throw new GraphQLError('Email já está em uso', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const passwordHash = await hashPassword(input.password)
      const user = await ctx.prisma.user.create({
        data: { name: input.name, email: input.email, passwordHash },
      })

      const token = signToken(user.id)
      ctx.res.cookie('financy_token', token, COOKIE_OPTIONS)

      return { token, user }
    },

    login: async (
      _: unknown,
      { input }: { input: { email: string; password: string } },
      ctx: Context,
    ) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      })
      if (!user) {
        throw new GraphQLError('Credenciais inválidas', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      const valid = await comparePassword(input.password, user.passwordHash)
      if (!valid) {
        throw new GraphQLError('Credenciais inválidas', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      const token = signToken(user.id)
      ctx.res.cookie('financy_token', token, COOKIE_OPTIONS)

      return { token, user }
    },

    logout: (_: unknown, __: unknown, ctx: Context) => {
      ctx.res.clearCookie('financy_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      return true
    },

    updateProfile: async (
      _: unknown,
      { input }: { input: { name: string } },
      ctx: Context,
    ) => {
      const userId = requireAuth(ctx)
      const user = await ctx.prisma.user.update({
        where: { id: userId },
        data: { name: input.name },
      })
      return user
    },
  },
}
