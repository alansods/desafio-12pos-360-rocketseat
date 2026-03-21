import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs } from './graphql/schema/typeDefs'
import { resolvers } from './graphql/resolvers'
import { createContext } from './graphql/context'

async function bootstrap() {
  const app = express()

  app.use(express.json())
  app.use(cookieParser())
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    }),
  )

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  await server.start()

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: createContext,
    }),
  )

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`)
  })
}

bootstrap().catch(console.error)
