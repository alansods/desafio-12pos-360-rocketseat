export const typeDefs = `#graphql
  scalar DateTime

  enum TransactionType {
    INCOME
    EXPENSE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: DateTime!
  }

  type Category {
    id: ID!
    name: String!
    color: String!
    icon: String!
    description: String!
  }

  type CategorySummary {
    category: Category!
    count: Int!
    total: Float!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: TransactionType!
    date: DateTime!
    category: Category!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type TransactionPage {
    items: [Transaction!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type Summary {
    totalIncome: Float!
    totalExpense: Float!
    balance: Float!
    recentTransactions: [Transaction!]!
    categoryBreakdown: [CategorySummary!]!
  }

  type Query {
    me: User!
    categories: [Category!]!
    category(id: ID!): Category!
    transactions(
      page: Int
      pageSize: Int
      categoryId: ID
      type: TransactionType
      startDate: DateTime
      endDate: DateTime
      search: String
    ): TransactionPage!
    transaction(id: ID!): Transaction!
    summary: Summary!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: Boolean!

    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    createTransaction(input: TransactionInput!): Transaction!
    updateTransaction(id: ID!, input: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!

    updateProfile(input: UpdateProfileInput!): User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CategoryInput {
    name: String!
    color: String!
    icon: String
    description: String
  }

  input UpdateProfileInput {
    name: String!
  }

  input TransactionInput {
    title: String!
    amount: Float!
    type: TransactionType!
    date: DateTime!
    categoryId: ID!
  }
`
