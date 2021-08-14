import { NextFunction, Request, Response } from 'express'
import { IMidware } from './midware'

export interface ErrorResponse extends Error {
  status?: number
  body?: string
}
export interface ErrMidware {
  (err: ErrorResponse, req: Request, res: Response, next: NextFunction): Promise<void>
}
