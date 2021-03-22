import passport, { authenticate } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import { Request, Response, NextFunction } from 'express'

import UserModel from '@models/User/Model'
import { JsonWebTokenError } from 'jsonwebtoken'
import { cRequest, handler, JWTpayload, RequestCookie } from 'src/coreApp'
import _ from 'lodash'
import { compare } from 'bcryptjs'
import boom from '@hapi/boom'
import { User } from '.prisma/client'
import createToken from './issueJWT'

const cookieExtractor = (req: RequestCookie<{ jwt: string }>) => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies.jwt
  }
  return token
}

const JWTOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTsecretOrKey,
  // passReqToCallback: false,
  // issuer: 'enter issuer here',
  // audience: 'enter audience here',
  // algorithms: ['RS256'],
  // ignoreExpiration: false,
}

passport.use(
  new JwtStrategy(JWTOptions, async (jwtPayload: JWTpayload, done: VerifiedCallback) => {
    try {
      const user = await UserModel.findUnique({ where: { id: jwtPayload.sub.id } })

      if (!user) return done(null, false)

      const payload: JWTpayload = {
        sub: { id: user.id, role: user.role === 'ADMIN' },
        iat: Date.now(),
      }
      console.log(user)
      return done(null, payload)
    } catch (error) {
      return done(error, false)
    }
  })
)

const JWTCookieOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWTsecretOrKey,
  passReqToCallback: false,
}
passport.use(
  'jwtCookie',
  new JwtStrategy(JWTCookieOptions, async (jwtPayload: JWTpayload, done: VerifiedCallback) => {
    console.log(jwtPayload.sub)
    try {
      const user = await UserModel.findUnique({ where: { id: jwtPayload.sub.id } })

      if (!user) return done(null, false)

      const payload = {
        user: { id: user.id, role: user.role === 'ADMIN' },
        iat: Date.now(),
      }
      return done(null, payload)
    } catch (error) {
      return done(error, false)
    }
  })
)

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.create({ data: { email, password } })

        return done(null, user)
      } catch (error) {
        done(error)
      }
    }
  )
)

// passport.use(
//   'login',
//   new LocalStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password',
//     },
//     async (email, password, done) => {
//       try {
//         const user = await UserModel.findUnique({ where: { email } })

//         if (_.isEmpty(user)) {
//           return done(null, false, { message: 'User not found' })
//         }

//         const validate = await UserModel.isValidPassword(password, user.password)

//         if (!validate) {
//           return done(null, false, { message: 'Wrong Password' })
//         }

//         return done(null, user, { message: 'Logged in Successfully' })
//       } catch (error) {
//         return done(error)
//       }
//     }
//   )
// )
const login: handler = async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await authenticate('login', async (err, user: User, _info) => {
      try {
        if (err || !user) {
          const error = new Error('An error occurred.')

          return next(error)
        }

        req.logIn(user, { session: false }, async (error) => {
          if (error) return next(error)

          const token = await createToken({ user, expiresIn: '10s' })
          // const rtoken = await createToken({ user, expiresIn: '1m' })

          res.cookie('jwt', token.token, {
            httpOnly: true,
            // sameSite: true,
            // signed: true,
            expires: new Date(Date.now() + 900000),
            secure: process.env.NODE_ENV === 'production',
          })
          return res.json({ token })
        })
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
// export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//   if (req.isAuthenticated()) {
//     return next()
//   }
//   return next(boom.unauthorized())
// }

/**
 * Authorization Required middleware.
 */

export default passport
