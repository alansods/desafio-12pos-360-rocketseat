import { gql } from '@apollo/client'

export const TRANSACTIONS_QUERY = gql`
  query Transactions(
    $page: Int
    $pageSize: Int
    $categoryId: ID
    $type: TransactionType
    $startDate: DateTime
    $endDate: DateTime
    $search: String
  ) {
    transactions(
      page: $page
      pageSize: $pageSize
      categoryId: $categoryId
      type: $type
      startDate: $startDate
      endDate: $endDate
      search: $search
    ) {
      items {
        id
        title
        amount
        type
        date
        category {
          id
          name
          color
          icon
        }
        createdAt
        updatedAt
      }
      total
      page
      pageSize
      totalPages
    }
  }
`

export const SUMMARY_QUERY = gql`
  query Summary {
    summary {
      totalIncome
      totalExpense
      balance
      recentTransactions {
        id
        title
        amount
        type
        date
        category {
          id
          name
          color
          icon
        }
      }
      categoryBreakdown {
        category {
          id
          name
          color
          icon
        }
        count
        total
      }
    }
  }
`
