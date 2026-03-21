import { ExpressContextFunctionArgument } from '@apollo/server/express4'
import { prisma } from '../lib/prisma'
import { verifyToken } from '../lib/jwt'

export interface Context {
  prisma: typeof prisma
  userId: string | null
  res: ExpressContextFunctionArgument['res']
}

export async function createContext({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<Context> {
  let token: string | null = null

  const cookieToken = req.cookies?.financy_token
  if (cookieToken) {
    token = cookieToken
  }

  if (!token) {
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }
  }

  let userId: string | null = null
  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      userId = payload.userId
    }
  }

  return { prisma, userId, res }
}

export function requireAuth(ctx: Context): string {
  if (!ctx.userId) {
    throw new Error('UNAUTHENTICATED')
  }
  return ctx.userId
}
