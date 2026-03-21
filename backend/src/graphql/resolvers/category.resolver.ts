import { GraphQLError } from 'graphql'
import { Context, requireAuth } from '../context'

export const categoryResolver = {
  Query: {
    categories: async (_: unknown, __: unknown, ctx: Context) => {
      const userId = requireAuth(ctx)
      return ctx.prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      })
    },

    category: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      const userId = requireAuth(ctx)
      const category = await ctx.prisma.category.findFirst({
        where: { id, userId },
      })
      if (!category) throw new GraphQLError('Categoria não encontrada')
      return category
    },
  },

  Mutation: {
    createCategory: async (
      _: unknown,
      { input }: { input: { name: string; color: string } },
      ctx: Context,
    ) => {
      const userId = requireAuth(ctx)

      const existing = await ctx.prisma.category.findUnique({
        where: { name_userId: { name: input.name, userId } },
      })
      if (existing) {
        throw new GraphQLError('Categoria com esse nome já existe', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      return ctx.prisma.category.create({
        data: { ...input, userId },
      })
    },

    updateCategory: async (
      _: unknown,
      { id, input }: { id: string; input: { name: string; color: string } },
      ctx: Context,
    ) => {
      const userId = requireAuth(ctx)

      const category = await ctx.prisma.category.findFirst({
        where: { id, userId },
      })
      if (!category) throw new GraphQLError('Categoria não encontrada')

      const duplicate = await ctx.prisma.category.findFirst({
        where: { name: input.name, userId, NOT: { id } },
      })
      if (duplicate) {
        throw new GraphQLError('Categoria com esse nome já existe', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      return ctx.prisma.category.update({
        where: { id },
        data: input,
      })
    },

    deleteCategory: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context,
    ) => {
      const userId = requireAuth(ctx)

      const category = await ctx.prisma.category.findFirst({
        where: { id, userId },
      })
      if (!category) throw new GraphQLError('Categoria não encontrada')

      await ctx.prisma.category.delete({ where: { id } })
      return true
    },
  },
}
