import type { NextFunction, Request, Response } from "express-serve-static-core";
import UnauthorizedError from "../errors/unauthorized.ts";

import jwt from "jsonwebtoken";
import User from "../models/User.ts";

async function AuthMiddleware(req: Request, _res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error();
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error();
        }
        const payload = <jwt.UserIDJwtPayload>jwt.verify(token, process.env.JWT_SECRET!);
        const userId = payload.userId;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error();
        }
        req.user = {
            _id: String(user._id),
            username: user.username
        }
        next();
    } catch (error) {
        next(new UnauthorizedError('Invalid authorization'))
    }
}

export default AuthMiddleware;