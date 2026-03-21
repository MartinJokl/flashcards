import type { Flashcard } from "./flashcards";

export type Set = {
  name: string,
  description: string | null | undefined,
  creatorName: string,
  id: string,
  likes: number,
  isLiked: boolean,
  createdAt: string
}
export type FullSet = {
  name: string,
  description: string | null | undefined,
  id: string,
  likes: number,
  createdBy: string,
  creatorName: string,
  isLiked: boolean,
  createdAt: string,
  flashcards: Flashcard[]
}