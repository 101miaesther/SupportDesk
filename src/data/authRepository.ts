import type { User } from '@/types/domain'

interface StaffCredential {
  user: User
  password: string
}
//mock login data
const STAFF: StaffCredential[] = [
  { user: { id: 'u1', name: 'Amara Okoye', email: 'amara@supportdesk.test', role: 'agent' }, password: 'agent123' },
  { user: { id: 'u2', name: 'Daniel Reyes', email: 'daniel@supportdesk.test', role: 'agent' }, password: 'agent123' },
  { user: { id: 'u3', name: 'Priya Natarajan', email: 'priya@supportdesk.test', role: 'supervisor' }, password: 'super123' },
]

export const authRepository = {
  async login(email: string, password: string): Promise<User | null> {
    const match = STAFF.find(
      s => s.user.email.toLowerCase() === email.toLowerCase() && s.password === password
    )
    return match ? match.user : null
  },
  async getUserById(id: string): Promise<User | undefined> {
    return STAFF.find(s => s.user.id === id)?.user
  },
  async listStaff(): Promise<User[]> {
    return STAFF.map(s => s.user)
  },
}