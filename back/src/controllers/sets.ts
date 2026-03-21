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
import type { potencialLikerQuery } from '../types/potencial-liker-query.ts';
import mongoose from 'mongoose';

export async function getSet(req: Request<IdParams, {}, {}, potencialLikerQuery>, res: Response<SetResponse>) {
    const potencialLiker: string | undefined = req.query.potencialLiker;

    const setId: string = req.params.id;
    const set = await Set.findById(setId);
    if (!set) {
        throw new NotFoundError('Set does not exist')
    }
    const flashcards: Flashcard[] = set.flashcards.map(card => {
        return { question: card.question ?? 'question', answer: card.answer ?? 'answer' }
    });
    let isLiked: boolean | null = null;
    if (potencialLiker) {
      isLiked = set.likers.includes(new mongoose.Types.ObjectId(potencialLiker));
    }
    res.status(200).json({
        name: set.name, 
        description: 
        set.description, 
        id: String(set._id), 
        likes: set.likes, 
        createdBy: String(set.createdBy), 
        creatorName: set.creatorName, 
        isLiked: isLiked ?? false,
        createdAt: set.createdAt,
        flashcards
    })
}

export async function getAllSets(req: Request<{}, {}, {}, SetQueryParams>, res: Response<SetsResponse>) {
    const {name, sort, likerId, createdBy, getCount, potencialLiker} = req.query;
    const queryObject: {
        name?: object,
        likers?: mongoose.Types.ObjectId,
        createdBy?: mongoose.Types.ObjectId
    } = {};
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' } // i = case insesitive
    }
    if (likerId) {
        queryObject.likers = new mongoose.Types.ObjectId(likerId);
    }
    if (createdBy) {
        queryObject.createdBy = new mongoose.Types.ObjectId(createdBy);
    }
    let result = Set.find(queryObject);

    if (sort) {
        result = result.sort(sort.replace(/\,/g, ' ')); // v api callu chci rozdelit sorty , tady to funguje na ' '.
        // divnej replace s regexes, aby vymenil vsechny, ne jeden
    }
    else {
        result = result.sort('-likes name');
    }

    const limit: number = Number(req.query.limit ?? 10);
    const page: number = Number(req.query.page ?? 1);
    const skip: number = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const sets = await result.select(`name description creatorName _id likes ${potencialLiker ? 'likers' : ''} createdAt`);
    const returnSets = sets.map(set => {
      let isLiked: boolean | null = null;
        if (potencialLiker) {
            isLiked = set.likers?.includes(new mongoose.Types.ObjectId(potencialLiker));
        }

        return {
            name: set.name,
            description: set.description,
            creatorName: set.creatorName,
            id: String(set._id),
            likes: set.likes,
            isLiked: isLiked ?? false,
            createdAt: set.createdAt
        }
    });
    const returnObject: { 
      hits?: number, 
      sets: {
        name: string,
        description: string | null | undefined,
        creatorName: string,
        id: string,
        likes: number,
        isLiked: boolean,
        createdAt: Date
      }[] 
    } = { sets: returnSets }

    if (getCount && getCount === 'true') {
      returnObject.hits = await Set.countDocuments(queryObject);
    }
     
    res.status(200).json(returnObject)
}

export async function createSet(req: Request<{}, {}, SetBody>, res: Response<IdResponse>) {
    const user: UserReqType = req.user!;
    if (!req.body || !req.body.flashcards || !req.body.name) {
        throw new BadRequestError('You must provide flashcards and a name');
    }
    const creationSet: {
        name: string,
        description?: string,
        createdBy: string,
        creatorName: string,
        flashcards: Flashcard[]
    } = {name: req.body.name, createdBy: user.id, creatorName: user.username, flashcards: req.body.flashcards };
    if (req.body.description) {
        creationSet.description = req.body.description;
    }
    const set = await Set.create(creationSet);
    res.status(201).json({ id: String(set._id) });
}

export async function updateSet(req: Request<IdParams, {}, SetBody>, res: Response<MessageResponse>) {
    const user: UserReqType = req.user!;
    const setId: string = req.params.id;
    
    const set = await Set.findOneAndUpdate({ _id: setId, createdBy: user.id }, req.body, { runValidators: true });
    if (!set) {
        throw new NotFoundError('Set does not exist');
    }
    res.status(200).json({message: 'Set updated'});
}

export async function deleteSet(req: Request<IdParams>, res: Response<MessageResponse>) {
    const user: UserReqType = req.user!;
    const setId: string = req.params.id;
    await Set.findOneAndDelete({ _id: setId, createdBy: user.id });
    res.status(200).json({message: 'Set deleted'})
}

export async function likeSet(req: Request<IdParams>, res: Response<MessageResponse>) {
    const user: UserReqType = req.user!;
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(user.id)
    const setId: string = req.params.id;
    const set = await Set.findByIdAndUpdate(setId, { 
        $addToSet: { likers: userId }
    }, { new: true });

    if (!set) {
        throw new NotFoundError('Set does not exist');
    }

    await set.updateOne({ 
        likes: set.likers.length
    });
    
    res.status(200).json({ message: 'Set liked' })
}

export async function unlikeSet(req: Request<IdParams>, res: Response<MessageResponse>) {
    const user: UserReqType = req.user!;
    const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(user.id)
    const setId: string = req.params.id;
    const set = await Set.findByIdAndUpdate(setId, { 
        $pull: { likers: userId }
    }, { new: true });

    if (!set) {
        throw new NotFoundError('Set does not exist');
    }

    await set.updateOne({ 
        likes: set.likers.length
    });
    
    res.status(200).json({ message: 'Set unliked' })
}