import { User } from 'entities'

export interface IRoleService {
  getUsers(): Promise<User[]>
  getGroup(): void
  isGranted(userId: string): Promise<boolean>
  registerUser(userId: string): void
  withdrawUser(userId: string): void
}
