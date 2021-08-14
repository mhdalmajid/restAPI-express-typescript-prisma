import { IPayload } from '@core/types/payload'
import { PrismaClient } from '@prisma/client'

import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'

const prisma = new PrismaClient()

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTsecretKey,
  // issuer: 'http://localhost:3000',
  // audience: 'http://localhost:3000',
}

export const jwt = new Strategy(opts, async (payload: IPayload, done) => {
  try {
    const User = await prisma.user.findUnique({
      where: {
        id: Number(payload.user.id),
      },
    })
    if (User) return done(null, User)

    return done(null, false)
  } catch (err) {
    return done(err, false)
  }
})
