import type { NextFunction, Request, Response } from "express-serve-static-core";
import CustomAPIError from "../errors/custom.ts";
import type { MessageResponse } from "../types/message-response.ts";

function ErrorHandlerMiddleware(err: Error, _req: Request, res: Response<MessageResponse>, _next: NextFunction) {
    if (err instanceof CustomAPIError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    console.log(err.message);
    res.status(500).json({ message: 'Something went wrong' });
}

export default ErrorHandlerMiddleware;
