import type { Set } from './set';

export type SetsResponse = {
  hits?: number, 
  sets: Set[]
}
export type TokenResponse = {
  token: string
}
export type MessageResponse = {
  message: string
}
export type UserResponse = {
  username: string
}