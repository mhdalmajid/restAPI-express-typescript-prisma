import { Router } from 'express'
import _ from 'lodash'
import Validate from '@models/User/Validation'
import createToken from 'src/lib/auth/issueJWT'
import { authenticate } from 'passport'
import { User } from '@prisma/client'
import { RequestCookie } from 'src/coreApp'
import UserModel from '@models/User/Model'
import boom from '@hapi/boom'
import jwt from 'jsonwebtoken'
import ms from 'ms'

const router = Router()

// res.cookie('jwt', refreshtokenObject.token, {
//   httpOnly: true,
//   sameSite: true,
//   signed: true,
//   secure: true,
// })
// res.setHeader('authorization', tokenObject.token)

router.post('/login', async (req, res, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { email, password } = req.body
  try {
    const user = await UserModel.findUnique({ where: { email } })

    if (_.isEmpty(user)) {
      return next(boom.badRequest('invalide email or password'))
    }

    const validate = await UserModel.isValidPassword(password, user.password)

    if (!validate) {
      return next(boom.badRequest('invalide email or password'))
    }

    const token = await createToken({ user, expiresIn: '20s' })
    const rtoken = await createToken({ user, expiresIn: '7d' })

    res.cookie('jwt', rtoken.token, {
      httpOnly: true,
      // sameSite: true,
      // signed: true,
      expires: new Date(Date.now() + ms('7d')),
      secure: process.env.NODE_ENV === 'production',
    })
    return res.json({ token })
  } catch (error) {
    return next(error)
  }
})

router.post('/signup', Validate('signup'), authenticate('signup', { session: false }), (req, res, next) => {
  res.json({ ok: true })
})

router.get('/profile', authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.query.secret_token,
    now: Date.now(),
  })
})

router.get('/profileByCookie', authenticate('jwtCookie', { session: false }), (req, res, next) => {
  res.json({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.query.secret_token,
    now: Date.now(),
  })
})

router.get('/logout', (req: RequestCookie<{ jwt: string }>, res) => {
  if (req.cookies && req.cookies.jwt) {
    res.clearCookie('jwt').status(200).json({
      message: 'You have logged out',
    })
    req.user = null
    req.logout()
  } else {
    res.status(401).json({
      error: 'Invalid jwt',
    })
  }
})

export default router
