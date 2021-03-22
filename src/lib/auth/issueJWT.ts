import jsonwebtoken from 'jsonwebtoken'
import { User } from '.prisma/client'

type tokenGenerator = (data: {
  user: User
  expiresIn: string
}) => Promise<{
  token: string
  expires: string
}>

const createToken: tokenGenerator = ({ user, expiresIn }) => {
  const { id, role } = user

  const isAdmin = role === 'ADMIN'
  const secret = process.env.JWTsecretOrKey
  const payload = {
    sub: { id, role: isAdmin },
    // iat: Date.now(),
    // exp: 20,
  }

  const token = jsonwebtoken.sign(payload, secret, { expiresIn })
  // const token = jsonwebtoken.sign(payload, secret)

  const data = {
    token: `Bearer ${token}`,
    expires: expiresIn,
  }
  return Promise.resolve(data)
}

export default createToken
