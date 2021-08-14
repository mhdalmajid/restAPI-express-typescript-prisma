import passport from 'passport'
import jwt from 'jsonwebtoken'
import { IMidware } from '@core/types'
import { IPayload } from '@core/types/payload'

export const login: IMidware = async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    if (err || !user) {
      const error = new Error('An error occurred.')

      return next(error)
    }

    req.login(user, { session: false }, async (error) => {
      const { id, email, role } = user

      if (error) return next(error)

      const body = { id, email, role }

      const token = jwt.sign({ user: body }, process.env.JWTsecretKey!, { expiresIn: '1d' })
      req.headers.authorization = `Bearer ${token}`
      return res.json({ token })
    })
  })(req, res, next)
}
