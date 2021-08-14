import { IMidware } from '@core/types'
import { authenticate } from 'passport'
import { unauthorized } from '@hapi/boom'
import { Role } from '@core/types/Role'
import { IPayload } from '@core/types/payload'
import { User } from '@prisma/client'
import { wrap } from 'lodash'

export const authorization =
  (role: Role, strategy: 'jwt'): IMidware =>
  async (req, res, next) => {
    if (role === 'FREE') return next()
    authenticate(strategy, (err, user: User, _info) => {
      if (err) return next(err)

      if (!user || role !== user.role) return next(unauthorized())

      req.user = { id: user.id, email: user.email, role: user.role }

      next()
    })(req, res, next)
  }
