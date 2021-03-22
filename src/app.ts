import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import path from 'path'
import helmet from 'helmet'
import compression from 'compression'
import boom, { badRequest, boomify } from '@hapi/boom'
import router from '@routes/index.routes'
import swaggerUi from 'swagger-ui-express'
import { logger, morganMiddleware } from 'src/lib/Logger'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { SESSION_OPTIONS } from 'src/lib/config/session'
import UserModel from '@models/User/Model'
import passport from './lib/auth/passport'
import { store } from './lib/Redis'
import swaggerDocument from './swagger.def'
import { ErrorHandler } from './coreApp'

const AppInit = () => {
  const app = express()

  /** *****************
   *      Logger
   *   Use just in dev
   * ******************
   */
  app.use(morganMiddleware)

  app.set('views', path.resolve(__dirname, 'views'))
  app.disable('x-powered-by')
  app.use(helmet())

  /** *****************
   *  enable CORS with
   *  various options
   * ******************
   */
  app.use(cors())

  app.use(express.static(path.join(__dirname, 'public')))
  app.use(compression())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  /** *****************
   *  handle bodyParser
   *  Errors badRequest
   * ******************
   */
  app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      next(boom.badRequest(`Invalid Request data:${err.body}`))
    } else {
      next()
    }
  })

  /** *****************
   *   Session initialize
   *   using Redis Store
   * ******************
   */
  app.use(cookieParser(process.env.cookieParserSecret))
  // app.use(session({ ...SESSION_OPTIONS, store }))
  // app.use((req, res, next) => {
  //   if (!req.session) {
  //     return next(new Error('session lost connecting')) // handle error
  //   }
  //   next()
  // })
  /** *****************
   *   AUTH initialize
   *   Using Passportjs
   * ******************
   */
  app.use(passport.initialize())
  passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user)
  })

  passport.deserializeUser(async (id, done) => {
    UserModel.findUnique({ where: { id: +id } })
      .then((user) => done(false, user.id))
      .catch((err) => done(err, false))
  })

  // app.use((req, res, next) => {
  //   res.locals.user = req.user
  //   next()
  // })

  /** *****************
   *  swaggerUi initialize
   *   swaggerDocument
   * ******************
   */
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  /** *****************
   *    Main Router
   *   Handle All Routes
   * ******************
   */
  app.use(router)
  /** *****************
   *   Hanlde Not found
   *   and server Error
   * ******************
   */
  app.use((req, res, next) => {
    next(boom.notFound('Page not found'))
  })

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const boomified = boomify(error)
    // console.log(boomified)
    res.status(boomified.output.statusCode).json({
      ...boomified.output.payload,
    })
    console.log(error)
  })

  return app
}
export default AppInit
