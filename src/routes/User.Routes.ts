import { RequestHandler, Request, Response, NextFunction, Router } from 'express'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'
import boom, { badRequest } from '@hapi/boom'
import UserModel from '@models/User/Model'
import { IUser } from '@models/User/IUser'
import Joi from 'joi'
import Validate from '@models/User/Validation'

const router = Router()
const prisma = new PrismaClient()

interface CustomRequest<T> extends Request {
  body: T
}

router.post('/signup', Validate('create'), async (req: CustomRequest<IUser>, res, next) => {
  const { email, password } = req.body
  try {
    const id = await UserModel.create({ email, password })
    res.json(id)
  } catch (error) {
    next(boom.badRequest('Email already exist'))
  }
})

router.post('/login', Validate('login'), async (req: CustomRequest<IUser>, res, next) => {
  const { email, password } = req.body

  try {
    const done = await UserModel.getByEmail(req.body.email)
    res.json(done)
  } catch (error) {
    next(boom.badRequest('Email already exist'))
  }
})

export default router
