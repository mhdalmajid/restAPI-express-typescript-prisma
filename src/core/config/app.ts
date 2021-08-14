import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import * as expressWinston from 'express-winston'
import compression from 'compression'
import boom, { badData, boomify } from '@hapi/boom'
import router from '@controllers/index.routes'
import cors from 'cors'
import { passport } from '@auth/index'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'
import { loggerOptions } from './logger'
import { ErrorResponse } from '../types/core.interface'

const app = express()
if (!process.env.DEBUG) {
  loggerOptions.meta = false // when not debugging, make terse
  if (typeof global.it === 'function') {
    loggerOptions.level = 'http' // for non-debug test runs, squelch entirely
  }
}
const dirPath = path.join(`${__dirname}../../../controllers/**/*.ts`)
// const absolutePath = path.resolve('src/controllers/Home/home.controllers.ts')
// console.log(absolutePath)
console.log(dirPath)

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'myApp',
      version: '1.0.0',
    },
  },
  apis: [dirPath],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(expressWinston.logger(loggerOptions))

app.disable('x-powered-by')
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** *****************
 *  handle bodyParser
 *  Errors badData
 * ******************
 */
app.use((err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    next(badData(err.body))
  } else {
    next()
  }
})

app.use(passport.initialize())

/** *****************
 *    Main Router
 *   Handle All Routes
 * ******************
 */

app.use(router)

// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger(loggerOptions))
/** *****************
 *   Hanlde Not found
 *   and server Error
 * ******************
 */
app.use((req, res, next) => {
  next(boom.notFound('Page not found'))
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  const boomified = boomify(error)
  // console.log(boomified)
  res.status(boomified.output.statusCode).json({
    ...boomified.output.payload,
  })
})

export default app
