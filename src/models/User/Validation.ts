import { RequestHandler, Request, Response, NextFunction, Router } from 'express'
import Joi from 'joi'
import { badRequest } from '@hapi/boom'
import { IUser } from './IUser'

interface LoginRequest<T> extends Request {
  body: T
}
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
}

const schemaRules = {
  password: Joi.string()
    .min(3)
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
      login: (schema) => schema.required(),
    }),
  email: Joi.string()
    .email()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
      login: (schema) => schema.required(),
    }),
  name: Joi.string().optional(),
  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .label('Confirm password')
    .options({ messages: { 'any.only': '{{#label}} does not match' } }),

  // confirmPassword: Joi.any().valid(Joi.ref('password')).required(),

  birthday: Joi.date().optional(),
}

const schema = Joi.object(schemaRules)

const createSchema = schema.with('password', 'confirmPassword').messages({ any: 'shit' }).tailor('create')
const updateSchema = schema.with('password', 'confirmPassword').tailor('update')
const loginSchema = schema.tailor('login')

const Validate = (validationType: 'login' | 'create' | 'update') => {
  return (req: LoginRequest<IUser>, res: Response, next: NextFunction) => {
    try {
      let schema: Joi.Schema

      switch (validationType) {
        case 'login':
          schema = loginSchema
          break
        case 'create':
          schema = createSchema
          break
        case 'update':
          schema = updateSchema
          break
        default:
          schema = createSchema
      }
      console.log(req.body)
      const { error, value } = schema.validate(req.body, options)
      if (error) {
        // on fail return comma separated errors
        next(badRequest(`${error.details.map((x) => x.message).join(', ')}`))
      } else {
        // on success replace
        // req.body with validated value
        // and trigger next middleware function
        req.body = value
        next()
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
export default Validate
