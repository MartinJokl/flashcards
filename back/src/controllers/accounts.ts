import type { Request, Response } from "express-serve-static-core";
import type { UserBody } from "../types/user-auth-body.ts";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../errors/index.ts";
import User from "../models/User.ts";
import type { MessageResponse } from "../types/message-response.ts";
import type { TokenResponse } from "../types/token-response.ts";
import type { IdParams } from "../types/id-params.ts";
import type { UserResponse } from "../types/user-response.ts";
import bcrypt from "bcryptjs";

async function hashPassword(password:string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}

export async function login(req: Request<{}, {}, UserBody>, res: Response<MessageResponse | TokenResponse>) {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new BadRequestError('You must provide a username and password');
    }
    const user = await User.findOne({ username });
    if (!user) {
        throw new UnauthorizedError('User does not exist');
    }
    const passwordCorrect = await user.checkPassword(password);
    if (!passwordCorrect) {
        throw new UnauthorizedError('Wrong password or username');
    }
    const token = user.createJWT();
    res.status(200).json({ token });
}

export async function getAccount(req: Request<IdParams>, res: Response<UserResponse>) {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User does not exist')
    }
    res.status(200).json({ username: user.username })
}

export async function createAccount(req: Request<{}, {}, UserBody>, res: Response<MessageResponse | TokenResponse>) {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new BadRequestError('You must provide a username and password');
    }
    else if (password.length < 8) {
        throw new UnauthorizedError('Password must be at least 8 characters long');
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ username, password: hashedPassword });
    const token = user.createJWT();
    res.status(201).json({ token })
}

export async function updateAccount(req: Request<{}, {}, UserBody>, res: Response<MessageResponse>) {
    const user = req.user!;
    const { username, password } = req.body;

    if (password && password.length < 8) {
        throw new UnauthorizedError('Password must be at least 8 characters long');
    }
    const update: {
        username?: string,
        password?: string
    } = {};
    if (username) {
        update.username = username;
    }
    if (password) {
        const hashedPassword = await hashPassword(password);
        update.password = hashedPassword;
    }
    
    await User.findByIdAndUpdate(user.id, update, { runValidators: true });

    res.status(200).json({ message: 'User updated' });
}

export async function deleteAccount(req: Request, res: Response<MessageResponse>) {
    const user = req.user!;
    
    await User.findByIdAndDelete(user.id);

    res.status(200).json({ message: 'User deleted' });
}