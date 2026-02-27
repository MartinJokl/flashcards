import type { Request, Response } from 'express-serve-static-core';
import type { IdParams } from '../types/id-params.ts';
import type { SetQueryParams } from '../types/sets-query-params.ts';
import type { SetBody } from '../types/set-body.ts';
import Set from '../models/Set.ts';
import BadRequestError from '../errors/bad-request.ts';
import type { MessageResponse } from '../types/message-response.ts';

export async function getSet(req: Request<IdParams>, res: Response) {

}
export async function getAllSets(req: Request<{}, {}, {}, SetQueryParams>, res: Response) {

}
export async function createSet(req: Request<{}, {}, SetBody>, res: Response<MessageResponse>) {
    const user = req.user!;
    if (!req.body || !req.body.flashcards || !req.body.name) {
        throw new BadRequestError('You must provide flashcards and a name')
    }
    await Set.create({ flashcards: req.body.flashcards, name: req.body.name, createdBy: user._id });
    res.status(201).json({ message: 'Set created' });
}
export async function updateSet(req: Request<IdParams>, res: Response) {
    
}
export async function deleteSet(req: Request<IdParams>, res: Response) {

}