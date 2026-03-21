import { authResolver } from './auth.resolver'
import { categoryResolver } from './category.resolver'
import { transactionResolver } from './transaction.resolver'

export const resolvers = {
  DateTime: {
    serialize: (value: unknown) => {
      if (value instanceof Date) return value.toISOString()
      if (typeof value === 'string') return value
      return String(value)
    },
    parseValue: (value: unknown) => {
      if (typeof value === 'string') return new Date(value)
      throw new Error('DateTime must be a string')
    },
    parseLiteral: (ast: { kind: string; value?: string }) => {
      if (ast.kind === 'StringValue' && ast.value) return new Date(ast.value)
      throw new Error('DateTime must be a string literal')
    },
  },

  TransactionType: {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE',
  },

  Query: {
    ...authResolver.Query,
    ...categoryResolver.Query,
    ...transactionResolver.Query,
  },

  Mutation: {
    ...authResolver.Mutation,
    ...categoryResolver.Mutation,
    ...transactionResolver.Mutation,
  },
}
