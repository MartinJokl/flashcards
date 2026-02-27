import type { Request, Response } from 'express-serve-static-core';
import type { IdParams } from '../types/id-params.ts';
import type { SetQueryParams } from '../types/sets-query-params.ts';
import type { SetBody } from '../types/set-body.ts';
import Set from '../models/Set.ts';
import BadRequestError from '../errors/bad-request.ts';
import type { IdResponse } from '../types/id-response.ts';
import NotFoundError from '../errors/not-found.ts';
import type { SetResponse, SetsResponse } from '../types/set-responses.ts';
import type { Flashcard } from '../types/flashcard.ts';
import type { MessageResponse } from '../types/message-response.ts';

export async function getSet(req: Request<IdParams>, res: Response<SetResponse>) {
    const setId = req.params.id;
    const set = await Set.findById(setId);
    if (!set) {
        throw new NotFoundError('Set does not exist')
    }
    const flashcards = set.flashcards.map(card => {
        return { question: card.question ?? 'question', answer: card.answer ?? 'answer' }
    });
    res.status(200).json({ name: set.name, description: set.description, likes: set.likes, createdBy: String(set.createdBy), flashcards })
}

export async function getAllSets(req: Request<{}, {}, {}, SetQueryParams>, res: Response<SetsResponse>) {
    const {name, sort} = req.query;
    const queryObject: {
        name?: object
    } = {};
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' } // i = case insesitive
    }
    let result = Set.find(queryObject);

    if (sort) {
        result = result.sort(sort.replace(/\,/g, ' ')); // v api callu chci rozdelit sorty , tady to funguje na ' '.
        // divnej replace s regexes, aby vymenil vsechny, ne jeden
    }
    else {
        result = result.sort('-likes name');
    }

    const limit = Number(req.query.limit ?? 10);
    const page = Number(req.query.page ?? 1);
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const sets = await result.select('name description likes');
    const returnSets = sets.map(set => {
        return {
            name: set.name,
            description: set.description,
            likes: set.likes
        }
    })
     
    res.status(200).json({ sets: returnSets })
}

export async function createSet(req: Request<{}, {}, SetBody>, res: Response<IdResponse>) {
    const user = req.user!;
    if (!req.body || !req.body.flashcards || !req.body.name) {
        throw new BadRequestError('You must provide flashcards and a name');
    }
    const creationSet: {
        name: string,
        description?: string,
        createdBy: string,
        flashcards: Flashcard[]
    } = {name: req.body.name, createdBy: user.id,  flashcards: req.body.flashcards };
    if (req.body.description) {
        creationSet.description = req.body.description;
    }
    const set = await Set.create(creationSet);
    res.status(201).json({ id: String(set._id) });
}

export async function updateSet(req: Request<IdParams>, res: Response<MessageResponse>) {
    
}

export async function deleteSet(req: Request<IdParams>, res: Response<MessageResponse>) {
    
}