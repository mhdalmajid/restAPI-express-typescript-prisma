import express, { RequestHandler, NextFunction, Request, Response } from 'express'
import core = require('express-serve-static-core')

export interface ErrorHandler extends Error {
  status?: number
  body?: string
}
export interface cRequest<T> extends Request {
  body: T
}
export interface RequestCookie<T> extends Request {
  cookies: T
}

export type handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

// export declare function ash<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = core.Query>(
//   handler: (...args: Parameters<express.RequestHandler<P, ResBody, ReqBody, ReqQuery>>) => void | Promise<void>
// ): express.RequestHandler<P, ResBody, ReqBody, ReqQuery>

export const ash = (fn: handler) => (...args: [Request, Response, NextFunction]) => fn(...args).catch(args[2])
export interface JWTpayload {
  sub: { id: number; role: boolean }
  iat: number
}
