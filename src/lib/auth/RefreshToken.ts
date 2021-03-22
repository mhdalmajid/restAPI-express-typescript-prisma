import { handler, RequestCookie } from 'src/coreApp'
import jwt from 'jsonwebtoken'
import passport from './passport'

const refreshToken: handler = async (req: RequestCookie<{ jwt: string }>, res, next) => {
  const token = req.headers.authorization
  if (token && typeof token === 'string') {
    try {
      const payload = jwt.verify(token, process.env.JWTsecret)
      req.user = payload
      return next()
      const refreshToken = req.headers['x-refresh-token']
      const checkRefreshToken = jwt.verify(`${refreshToken}`, process.env.JWTsecret)
    } catch (err) {
      const token = await getTokenFromCookie(req)

      const newTokens = await refreshTokens(token, refreshToken, models, SECRET)
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token')
        res.set('x-token', newTokens.token)
        res.set('x-refresh-token', newTokens.refreshToken)
      }
      req.user = newTokens.user
    }
  }
  next()
}

export default refreshToken
