export interface IUser {
  email: string
  password?: string
  confirmPassword?: string
  id?: number
  name?: string
  role?: 'user' | 'admin'
  posts?: []
  profile?: []
  updatedAt?: Date
  createdAt?: Date
}
