import { GraphQLError } from 'graphql'
import { Context, requireAuth } from '../context'

interface TransactionInput {
  title: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  date: string
  categoryId: string
}

interface TransactionsArgs {
  page?: number
  pageSize?: number
  categoryId?: string
  type?: 'INCOME' | 'EXPENSE'
  startDate?: string
  endDate?: string
  search?: string
}

export const transactionResolver = {
  Query: {
    transactions: async (
      _: unknown,
      args: TransactionsArgs,
      ctx: Context,
    ) => {
      const userId = requireAuth(ctx)
      const page = args.page ?? 1
      const pageSize = args.pageSize ?? 10
      const skip = (page - 1) * pageSize

      const where: Record<string, unknown> = { userId }
      if (args.categoryId) where.categoryId = args.categoryId
      if (args.type) where.type = args.type
      if (args.search) where.title = { contains: args.search }
      if (args.startDate || args.endDate) {
        where.date = {
          ...(args.startDate ? { gte: new Date(args.startDate) } : {}),
          ...(args.endDate ? { lte: new Date(args.endDate) } : {}),
        }
      }

      const [items, total] = await ctx.prisma.$transaction([
        ctx.prisma.transaction.findMany({
          where,
          include: { category: true },
          orderBy: { date: 'desc' },
          skip,
          take: pageSize,
        }),
        ctx.prisma.transaction.count({ where }),
      ])

      return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    },

    transaction: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context,
    ) => {
      const userId = requireAuth(ctx)
      const transaction = await ctx.prisma.transaction.findFirst({
        where: { id, userId },
        include: { category: true },
      })
      if (!transaction) throw new GraphQLError('Transação não encontrada')
      return transaction
    },

    summary: async (_: unknown, __: unknown, ctx: Context) => {
      const userId = requireAuth(ctx)

      const transactions = await ctx.prisma.transaction.findMany({
        where: { userId },
        include: { category: true },
      })

      const totalIncome = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0)

      const totalExpense = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)

      const recentTransactions = await ctx.prisma.transaction.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { date: 'desc' },
        take: 5,
      })

      const categoryMap = new Map<string, { category: (typeof transactions)[0]['category']; count: number; total: number }>()
      for (const t of transactions) {
        const existing = categoryMap.get(t.categoryId)
        if (existing) {
          existing.count += 1
          existing.total += t.amount
        } else {
          categoryMap.set(t.categoryId, { category: t.category, count: 1, total: t.amount })
        }
      }
      const categoryBreakdown = Array.from(categoryMap.values()).sort((a, b) => b.total - a.total)

      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        recentTransactions,
        categoryBreakdown,
      }
    },
  },

  Mutation: {
    createTransaction: async (
      _: unknown,
      { input }: { input: TransactionInput },
      ctx: Context,
    ) => {
      const userId = requireAuth(ctx)

      const category = await ctx.prisma.category.findFirst({
        where: { id: input.categoryId, userId },
      })
      if (!category) throw new GraphQLError('Categoria não encontrada')

      return ctx.prisma.transaction.create({
        data: {
          title: input.title,
          amount: input.amount,
          type: input.type,
          date: new Date(input.date),
          categoryId: input.categoryId,
          userId,
        },
        include: { category: true },
      })
    },

    updateTransaction: async (
      _: unknown,
      { id, input }: { id: string; input: TransactionInput },
      ctx: Context,
    ) => {
      const userId = requireAuth(ctx)

      const transaction = await ctx.prisma.transaction.findFirst({
        where: { id, userId },
      })
      if (!transaction) throw new GraphQLError('Transação não encontrada')

      return ctx.prisma.transaction.update({
        where: { id },
        data: {
          title: input.title,
          amount: input.amount,
          type: input.type,
          date: new Date(input.date),
          categoryId: input.categoryId,
        },
        include: { category: true },
      })
    },

    deleteTransaction: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context,
    ) => {
      const userId = requireAuth(ctx)

      const transaction = await ctx.prisma.transaction.findFirst({
        where: { id, userId },
      })
      if (!transaction) throw new GraphQLError('Transação não encontrada')

      await ctx.prisma.transaction.delete({ where: { id } })
      return true
    },
  },
}
