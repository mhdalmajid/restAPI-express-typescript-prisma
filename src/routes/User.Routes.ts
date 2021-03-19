import { Request, Response, NextFunction, Router } from 'express'
import _ from 'lodash'
import boom from '@hapi/boom'
import UserModel from '@models/User/Model'
import { IUser } from '@models/User/IUser'
import Validate from '@models/User/Validation'
import { compare } from 'bcryptjs'
import { CustomUserRequest, handler } from 'src/coreApp'

const router = Router()

const createUser: handler = async (req: CustomUserRequest<IUser>, res, next) => {
  const { email, password } = req.body
  try {
    const id = await UserModel.create({ email, password })
    res.json(id)
  } catch (error) {
    next(boom.badRequest('Email already exist'))
  }
}

const login: handler = async (req: CustomUserRequest<IUser>, res, next) => {
  const { email, password } = req.body

  try {
    const user = await UserModel.getByEmail(email)
    if (_.isEmpty(user)) return next(boom.badRequest('invalide email or password'))

    const isPasswordMatched = await compare(password, user.password)

    if (!isPasswordMatched) return next(boom.badRequest('invalide email or password'))

    res.json({ done: 'loged in' })
  } catch (error) {
    next(error)
  }
}

router.post('/signup', Validate('create'), createUser)
router.post('/login', Validate('login'), login)
export default router
