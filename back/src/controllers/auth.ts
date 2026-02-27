import type { Request, Response } from "express-serve-static-core";
import type { LoginUser, RegisterUser } from "../types/user-auth-body.ts";
import BadRequestError from "../errors/bad-request.ts";
import User from "../models/User.ts";
import UnauthorizedError from "../errors/unauthorized.ts";
import type { MessageResponse } from "../types/message-response.ts";
import type { TokenResponse } from "../types/token-response.ts";

export async function register(req: Request<{}, {}, RegisterUser>, res: Response<MessageResponse | TokenResponse>) {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new BadRequestError('You must provide a username and password');
    }
    else if (password.length < 8) {
        throw new UnauthorizedError('Password must be at least 8 characters long');
    }
    const user = await User.create({ username, password });
    const token = user.createJWT();
    res.status(201).json({ token })
}

export async function login(req: Request<{}, {}, LoginUser>, res: Response<MessageResponse | TokenResponse>) {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new BadRequestError('You must provide a username and password');
    }
    const user = await User.findOne({ username });
    if (!user) {
        throw new UnauthorizedError('User does not exist');
    }
    const passwordCorrect = user.checkPassword(password);
    if (!passwordCorrect) {
        throw new UnauthorizedError('Wrong password or username');
    }
    const token = user.createJWT();
    res.status(200).json({ token });
}