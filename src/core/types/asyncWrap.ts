import { RequestHandler } from 'express'

export interface IascWrap {
  (fn: RequestHandler): RequestHandler
}
