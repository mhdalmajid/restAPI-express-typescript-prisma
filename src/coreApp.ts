import { NextFunction, Request, Response } from 'express'

export interface ErrorHandler extends Error {
  status?: number
  body?: string
}
export interface CustomUserRequest<T> extends Request {
  body: T
}

export type handler = (req: Request, res: Response, next: NextFunction) => unknown
