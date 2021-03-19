import { Router } from 'express'
import UserRoute from './User.Routes'

const router = Router()

router.get('/favicon.ico', (req, res) => res.status(204))

router.get('/', (req, res) => {
  res.status(200).json({ data: 'Lets GO' })
})

router.use('/user', UserRoute)

export default router
