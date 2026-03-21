import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const USER_ID = '838d3966-b385-4cea-8c5d-4a41c8eb042e'

const CATEGORIES: Record<string, string> = {
  Alimentação: 'f999022a-31b8-49b7-93d8-383ab110edae',
  Transporte: '4794f9ee-1e77-4656-adca-386795066d04',
  Mercado: 'c49cf20a-4d59-45fd-abc7-ee9cbf9f06bc',
  Investimento: '5ab835cd-448e-43eb-83d8-bab7494deffe',
  Utilidades: 'e4f342d5-06ff-4900-ac45-929743612e9d',
  Salário: 'a25194b3-4a98-46e1-907c-66bf402e939e',
  Entretenimento: '21219d8b-0332-497c-b8d5-3fe073ab0a16',
}

const transactions = [
  { title: 'Jantar no Restaurante', amount: 89.50,  type: 'EXPENSE', date: new Date('2025-11-30'), category: 'Alimentação' },
  { title: 'Posto de Gasolina',     amount: 100.00, type: 'EXPENSE', date: new Date('2025-11-29'), category: 'Transporte' },
  { title: 'Compras no Mercado',    amount: 156.80, type: 'EXPENSE', date: new Date('2025-11-28'), category: 'Mercado' },
  { title: 'Retorno de Investimento', amount: 340.25, type: 'INCOME', date: new Date('2025-11-26'), category: 'Investimento' },
  { title: 'Aluguel',               amount: 1700.00, type: 'EXPENSE', date: new Date('2025-11-26'), category: 'Utilidades' },
  { title: 'Freelance',             amount: 2500.00, type: 'INCOME',  date: new Date('2025-11-24'), category: 'Salário' },
  { title: 'Compras Jantar',        amount: 150.00, type: 'EXPENSE', date: new Date('2025-11-22'), category: 'Mercado' },
  { title: 'Cinema',                amount: 88.00,  type: 'EXPENSE', date: new Date('2025-12-18'), category: 'Entretenimento' },
]

async function main() {
  for (const t of transactions) {
    await prisma.transaction.create({
      data: {
        title: t.title,
        amount: t.amount,
        type: t.type,
        date: t.date,
        categoryId: CATEGORIES[t.category],
        userId: USER_ID,
      },
    })
    console.log(`✓ ${t.title}`)
  }
  console.log('\nSeed concluído!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
