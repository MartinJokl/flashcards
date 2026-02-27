import type { Flashcard } from "./flashcard.ts";

export interface SetBody {
    flashcards: Flashcard[],
    name: string
}