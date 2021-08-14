import { PrismaClient } from '@prisma/client'
import { Strategy } from 'passport-local'
import { hash } from 'bcryptjs'
import { conflict } from '@hapi/boom'

const prisma = new PrismaClient()

export const signup = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const isEmailExist = await prisma.user.findUnique({ where: { email } })

      if (isEmailExist) return done(conflict('Email already exist'))

      const hashed = await hash(password, +process.env.SALT!)

      const user = await prisma.user.create({
        data: { email, password: hashed },
        select: {
          email: true,
          id: true,
        },
      })

      return done(null, user)
    } catch (error) {
      done(error)
    }
  }
)
