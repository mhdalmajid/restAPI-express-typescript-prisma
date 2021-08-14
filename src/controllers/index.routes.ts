import { Router } from 'express'

import home from './Home/home.controller'
import User from './User/User.controller'
import auth from './Auth/auth.controller'
// import swaggerDocument from './swagger.def'

const Main = Router()
/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */

Main.use('/user', User)
Main.use('/', home)
Main.use('/auth', auth)

export default Main
