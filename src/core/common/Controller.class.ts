import { IMidware } from '@core/types'
import express from 'express'
import { wrap } from '@core/util/'
import { authorization } from '@core/common/CommonAuth'
import { validateSchema } from '@core/common/CommonValidation'
import { AlternativesSchema, ObjectSchema } from 'joi'
import { Role } from '@core/types/Role'

type method = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch'

export type handleOptions = {
  path: string
  permission: Role
  validationSchema: ObjectSchema | AlternativesSchema | false
  method: method
  handler: IMidware | [...[IMidware]]
}

class Controller {
  private _: express.Router

  public Router: express.Router

  constructor() {
    this._ = express.Router()
    this.Router = this._
  }

  private wrapper(handler: IMidware | [...[IMidware]]): IMidware[] {
    if (handler instanceof Function) return [wrap(handler)]
    return handler.map((fn) => wrap(fn))
  }

  public route({ path, method, permission, validationSchema, handler }: handleOptions) {
    if (validationSchema)
      this._[method](
        path,
        wrap(validateSchema(validationSchema)),
        wrap(authorization(permission, 'jwt')),
        ...this.wrapper(handler)
      )
    else this._[method](path, authorization(permission, 'jwt'), ...this.wrapper(handler))
  }
}

export default new Controller()
