import type { Flashcard } from "./flashcard.ts"

export interface SetResponse {
    name: string,
    description: string | null | undefined,
    id: string,
    likes: number,
    createdBy: string,
    creatorName: string,
    isLiked: boolean,
    createdAt: Date,
    flashcards: Flashcard[]
}

export interface SetsResponse {
    sets: {
        name: string,
        description: string | null | undefined,
        creatorName: string,
        id: string,
        likes: number,
        isLiked: boolean,
        createdAt: Date
    }[],
    hits?: number
}