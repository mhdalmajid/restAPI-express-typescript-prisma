import { PrismaClient, User } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export const UserService = {
  async getById(id: string | number) {
    const user = await prisma.user.findUnique({ where: { id: +id } })
    return user
  },
  async getByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    return user
  },
  /**
   *
   * @param  id user Id
   */
  async getProfile(id: string | number) {
    const user = await prisma.user.findUnique({ where: { id: +id } })
    if (user) user.password = ''
    return user
  },
  /**
   *
   * @returns object of users {id,email}
   */
  async getUsers() {
    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    })
    return user
  },
  /**
   *
   * @param  User Object of {email,password}
   */
  async createUser({ email, password }: Pick<User, 'email' | 'password'>) {
    const hashed = await hash(password, +process.env.SALT!)
    const user = await prisma.user.create({
      data: { email, password: hashed },
      select: {
        email: true,
        id: true,
      },
    })
    return user
  },
}
