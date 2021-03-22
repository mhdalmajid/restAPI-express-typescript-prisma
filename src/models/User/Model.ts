import { Prisma, PrismaClient, User as UserClient } from '@prisma/client'
import { compare, hash } from 'bcryptjs'

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
interface UserModelHooks {
  isValidPassword: (password: string, hashed: string) => Promise<boolean>
}

interface UserModel extends UserModelHooks, Prisma.UserDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation> {}

const db = new PrismaClient()
const User = db.user
const UserModel = User as UserModel

UserModel.isValidPassword = async (password: string, hashed: string) => compare(password, hashed)

// const UserModel = {
//   findOne: User.findUnique.bind(User),
//   findUnique: User.findUnique.bind(User),
//   update: User.update.bind(User),
//   findById: async (id: number, includePassword = false) => {
//     const user = await User.findUnique({
//       where: {
//         id,
//       },
//     })
//     if (includePassword) delete user.password
//     return user
//   },
//   findByEmail: async (email: string, includePassword = true) => {
//     const user = await User.findUnique({
//       where: {
//         email,
//       },
//     })
//     if (!includePassword) delete user.password
//     return user
//   },
//   create: async ({ email, password, name = '' }: IUser) => {
//     const id = await User.create({
//       data: {
//         email,
//         password: await hash(password, 10),
//         name,
//       },
//       select: { id: true },
//     })
//     return id
//   },

//   isValidPassword: async (password: string, hashed: string) => {
//     return compare(password, hashed)
//   },
// }

export default UserModel
