import { NextFunction, Request, Response } from 'express'

export type IMidware = (req: Request, res: Response, next: NextFunction) => Promise<any>
