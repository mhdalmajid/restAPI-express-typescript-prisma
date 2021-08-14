import { wrap } from '@core/util/'
import { IMidware } from '@core/types'
import { validationResult } from 'express-validator'

const validate: IMidware = async (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) next()
  res.status(400).send({ errors: errors.array() })
}

const welcome: IMidware = async (req, res, next) => {
  res.json({ welcome: 'welcome' })
}
export default { welcome: wrap(welcome) }
