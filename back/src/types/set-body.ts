import type { Flashcard } from "./flashcard.ts";

export interface SetBody {
    name: string,
    description: string | null | undefined,
    flashcards: Flashcard[]
}