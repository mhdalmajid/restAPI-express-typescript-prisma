import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Request, Response, NextFunction } from 'express'

// passport.serializeUser<any, any>((user, done) => {
//   done(null, user.id)
// })

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user)
//   })
// })
// /**
//  * Sign in using Email and Password.
//  */
// passport.use(
//   new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//     User.findOne({ email })
//       .then((user) => {
//         if (!user)
//           return done(null, false, {
//             message: 'email is not registered',
//           })
//         user.comparePassword(password, (err, isMatch) => {
//           if (err) return done(err, false)
//           if (isMatch) return done(null, user)
//           return done(null, false, {
//             message: 'Invalid email or password.',
//           })
//         })
//       })
//       .catch((error) => done(error, false))
//   })
// )
// export const passportConfig = passport
// export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
//   if (req.isAuthenticated()) next()
//   else res.redirect('/login')
// }
