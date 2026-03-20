import type { Flashcard } from "./flashcards";

export type Set = {
  name: string,
  description: string | null | undefined,
  creatorName: string,
  id: string,
  likes: number,
  isLiked: boolean
}
export type FullSet = {
  name: string,
  description: string | null | undefined,
  id: string,
  likes: number,
  createdBy: string,
  creatorName: string,
  isLiked: boolean,
  flashcards: Flashcard[]
}