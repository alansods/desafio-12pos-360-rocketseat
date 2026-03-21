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
  // Novembro 2025
  { title: 'Jantar no Restaurante',   amount: 89.50,   type: 'EXPENSE', date: new Date('2025-11-30'), category: 'Alimentação' },
  { title: 'Posto de Gasolina',       amount: 100.00,  type: 'EXPENSE', date: new Date('2025-11-29'), category: 'Transporte' },
  { title: 'Compras no Mercado',      amount: 156.80,  type: 'EXPENSE', date: new Date('2025-11-28'), category: 'Mercado' },
  { title: 'Retorno de Investimento', amount: 340.25,  type: 'INCOME',  date: new Date('2025-11-26'), category: 'Investimento' },
  { title: 'Aluguel',                 amount: 1700.00, type: 'EXPENSE', date: new Date('2025-11-26'), category: 'Utilidades' },
  { title: 'Freelance',               amount: 2500.00, type: 'INCOME',  date: new Date('2025-11-24'), category: 'Salário' },
  { title: 'Compras Jantar',          amount: 150.00,  type: 'EXPENSE', date: new Date('2025-11-22'), category: 'Mercado' },
  // Dezembro 2025
  { title: 'Cinema',                  amount: 88.00,   type: 'EXPENSE', date: new Date('2025-12-18'), category: 'Entretenimento' },
  { title: 'Salário Dezembro',        amount: 5500.00, type: 'INCOME',  date: new Date('2025-12-05'), category: 'Salário' },
  { title: 'Conta de Luz',            amount: 210.00,  type: 'EXPENSE', date: new Date('2025-12-07'), category: 'Utilidades' },
  { title: 'Uber',                    amount: 35.00,   type: 'EXPENSE', date: new Date('2025-12-10'), category: 'Transporte' },
  { title: 'Almoço Trabalho',         amount: 42.00,   type: 'EXPENSE', date: new Date('2025-12-11'), category: 'Alimentação' },
  { title: 'Dividendos',              amount: 180.00,  type: 'INCOME',  date: new Date('2025-12-15'), category: 'Investimento' },
  { title: 'Supermercado',            amount: 320.00,  type: 'EXPENSE', date: new Date('2025-12-20'), category: 'Mercado' },
  { title: 'Streaming',               amount: 55.90,   type: 'EXPENSE', date: new Date('2025-12-22'), category: 'Entretenimento' },
  { title: 'Táxi Aeroporto',          amount: 120.00,  type: 'EXPENSE', date: new Date('2025-12-28'), category: 'Transporte' },
  // Janeiro 2026
  { title: 'Salário Janeiro',         amount: 5500.00, type: 'INCOME',  date: new Date('2026-01-05'), category: 'Salário' },
  { title: 'Aluguel Janeiro',         amount: 1700.00, type: 'EXPENSE', date: new Date('2026-01-10'), category: 'Utilidades' },
  { title: 'Café da Manhã',           amount: 18.50,   type: 'EXPENSE', date: new Date('2026-01-12'), category: 'Alimentação' },
  { title: 'Manutenção Carro',        amount: 450.00,  type: 'EXPENSE', date: new Date('2026-01-14'), category: 'Transporte' },
  { title: 'Compras Mercado',         amount: 289.00,  type: 'EXPENSE', date: new Date('2026-01-16'), category: 'Mercado' },
  { title: 'Freelance Janeiro',       amount: 1800.00, type: 'INCOME',  date: new Date('2026-01-18'), category: 'Salário' },
  { title: 'Show de Música',          amount: 140.00,  type: 'EXPENSE', date: new Date('2026-01-20'), category: 'Entretenimento' },
  { title: 'Ações VALE3',             amount: 620.00,  type: 'INCOME',  date: new Date('2026-01-22'), category: 'Investimento' },
  { title: 'Internet',                amount: 99.90,   type: 'EXPENSE', date: new Date('2026-01-25'), category: 'Utilidades' },
  // Fevereiro 2026
  { title: 'Salário Fevereiro',       amount: 5500.00, type: 'INCOME',  date: new Date('2026-02-05'), category: 'Salário' },
  { title: 'Jantar Valentines',       amount: 230.00,  type: 'EXPENSE', date: new Date('2026-02-14'), category: 'Alimentação' },
  { title: 'Aluguel Fevereiro',       amount: 1700.00, type: 'EXPENSE', date: new Date('2026-02-10'), category: 'Utilidades' },
  { title: 'Academia',                amount: 89.90,   type: 'EXPENSE', date: new Date('2026-02-01'), category: 'Utilidades' },
  { title: 'Rendimento CDB',          amount: 410.00,  type: 'INCOME',  date: new Date('2026-02-20'), category: 'Investimento' },
  { title: 'Curso Online',            amount: 197.00,  type: 'EXPENSE', date: new Date('2026-02-22'), category: 'Entretenimento' },
  // Março 2026
  { title: 'Salário Março',           amount: 5500.00, type: 'INCOME',  date: new Date('2026-03-05'), category: 'Salário' },
  { title: 'Aluguel Março',           amount: 1700.00, type: 'EXPENSE', date: new Date('2026-03-10'), category: 'Utilidades' },
  { title: 'Mercado Semana',          amount: 175.00,  type: 'EXPENSE', date: new Date('2026-03-08'), category: 'Mercado' },
  { title: 'Gasolina',                amount: 85.00,   type: 'EXPENSE', date: new Date('2026-03-12'), category: 'Transporte' },
  { title: 'Restaurante Almoço',      amount: 67.00,   type: 'EXPENSE', date: new Date('2026-03-15'), category: 'Alimentação' },
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
