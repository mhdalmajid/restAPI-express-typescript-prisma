import { IMidware } from '@core/types'
import { badRequest } from '@hapi/boom'
import Joi from 'joi'

export const signupSchema = Joi.object({
  //   username: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

  confirm: Joi.ref('password'),

  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
}).with('password', 'confirm')

// export const signup: IMidware = async (req, res, next) => {
//   const { error } = signupSchema.validate(req.body, { allowUnknown: true })

//   if (error) next(badRequest(error.message))
//   else next()
// }
