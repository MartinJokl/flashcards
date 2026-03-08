import type { User } from "./user"

export type UserContextType = {
  reloadUser: () => Promise<void>,
  user: User | null
}