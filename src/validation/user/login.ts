import { IMidware } from '@core/types'
import { badRequest } from '@hapi/boom'
import Joi from 'joi'

export const loginSchema = Joi.object({
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
})
