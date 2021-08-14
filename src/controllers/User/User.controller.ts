import Controller from '@core/common/Controller.class'
import { unauthorized } from '@hapi/boom'
import { UserService } from '@service/User/User.service'
import { getById } from '@validation/user/getById'

Controller.route({
  path: '/profile',
  method: 'post',
  validationSchema: getById,
  permission: 'USER',
  handler: async (req, res) => {
    const { id } = req.body

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user?.id !== id) throw unauthorized()

    const user = await UserService.getProfile(id)

    res.json({ data: user })
  },
})

Controller.route({
  path: '/all',
  method: 'post',
  permission: 'FREE',
  validationSchema: false,
  handler: async (req, res, next) => {
    const user = await UserService.getUsers()
    res.json({ data: user })
  },
})

export default Controller.Router
