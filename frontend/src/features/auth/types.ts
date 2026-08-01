export type Role = 'farmer' | 'expert' | 'officer' | 'seller' | 'gov_admin' | 'super_admin'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  avatarUrl?: string
  authProvider: 'local' | 'google'
  isEmailVerified: boolean
  isActive: boolean
  createdAt: string
}

export interface AuthResponseData {
  user: User
  accessToken: string
}
