import { Role } from './Role'

export interface IPayload {
  user: { id: number; email: string; role: Role }
  iat: number
  exp: number
}
