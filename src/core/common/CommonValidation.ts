import { badRequest } from '@hapi/boom'
import { NextFunction, Request, Response } from 'express'
import { AlternativesSchema, ObjectSchema } from 'joi'

export const validateSchema =
  (schema: ObjectSchema | AlternativesSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { allowUnknown: true })
    if (error) next(badRequest(error.message))
    else next()
  }
