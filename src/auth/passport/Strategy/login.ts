import { PrismaClient } from '@prisma/client'
import { Strategy } from 'passport-local'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

export const login = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) return done(null, false, { message: 'User not found' })

      const validate = await compare(password, user.password)

      if (!validate) return done(null, false, { message: 'Wrong Password' })

      return done(null, user, { message: 'Logged in Successfully' })
    } catch (error) {
      return done(error)
    }
  }
)
