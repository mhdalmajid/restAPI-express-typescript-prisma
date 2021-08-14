import Joi from 'joi'

export const getById = Joi.object({
  id: Joi.alternatives(Joi.number(), Joi.string()).required(),
})
