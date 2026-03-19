import type { Flashcard } from "./flashcards";

export type Set = {
  name: string;
  description: string | null | undefined;
  creatorName: string;
  id: string;
  likes: number;
}
export type FullSet = {
  name: string,
  description: string | null | undefined,
  id: string,
  likes: number,
  createdBy: string,
  creatorName: string,
  flashcards: Flashcard[]
}