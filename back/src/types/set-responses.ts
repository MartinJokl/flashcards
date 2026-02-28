import type { Flashcard } from "./flashcard.ts"

export interface SetResponse {
    name: string,
    description: string | null | undefined,
    id: string,
    likes: number,
    createdBy: string,
    flashcards: Flashcard[]
}

export interface SetsResponse {
    sets: {
        name: string,
        description: string | null | undefined,
        id: string,
        likes: number
    }[]
}