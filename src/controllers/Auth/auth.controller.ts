import Controller from '@core/common/Controller.class'
import { AuthService } from '@service/Auth/Auth.service'
import { loginSchema, signupSchema } from '@validation/user/'

Controller.route({
  path: '/login',
  method: 'post',
  permission: 'FREE',
  validationSchema: loginSchema,
  handler: AuthService.login,
})

Controller.route({
  path: '/signup',
  method: 'post',
  permission: 'FREE',
  validationSchema: signupSchema,
  handler: async (req, res) => {
    const user = await AuthService.signup(req.body)
    res.json({ data: user })
  },
})

export default Controller.Router
