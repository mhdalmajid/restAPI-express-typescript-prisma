import { login } from '@auth/passport/authenticate/login'
import { User } from '@prisma/client'
import { UserService } from '@service/User/User.service'
import { conflict } from '@hapi/boom'

export const AuthService = {
  login,
  signup: async ({ email, password }: Pick<User, 'email' | 'password'>) => {
    const isEmailExist = await UserService.getByEmail(email)
    if (isEmailExist) throw conflict('email already Exist')
    const newUser = await UserService.createUser({ email, password })

    return newUser
  },
}
