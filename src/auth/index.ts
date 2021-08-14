import passport from 'passport'
import { jwt, login, signup } from './passport/Strategy'

passport.use('jwt', jwt)
passport.use('login', login)
passport.use('signup', signup)

export { passport }
