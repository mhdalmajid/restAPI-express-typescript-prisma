import { Prisma, PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

interface IUser {
  email: string
  password?: string
  id?: number
  name?: string
  role?: 'user' | 'admin'
  posts?: []
  profile?: []
  updatedAt?: Date
  createdAt?: Date
}

const db = new PrismaClient()

const getById = async (id: number, includePassword = false) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  })
  if (includePassword) delete user.password
  return user
}

const getByEmail = async (email: string, includePassword = true) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  })
  if (!includePassword) delete user.password
  return user
}

const create = async ({ email, password, name = '' }: IUser) => {
  const id = await db.user.create({
    data: {
      email,
      password: await hash(password, 10),
      name,
    },
    select: { id: true },
  })
  return id
}

const update = async (where: Prisma.UserWhereUniqueInput, data: {}) => {
  const id = await db.user.update({
    where,
    data,
    select: {
      id: true,
    },
  })
  return id
}

const UserModel = {
  db,
  getById,
  create,
  update,
  getByEmail,
}
export default UserModel
