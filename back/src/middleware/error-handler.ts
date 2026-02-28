import type { NextFunction, Request, Response } from "express-serve-static-core";
import CustomAPIError from "../errors/custom.ts";
import type { MessageResponse } from "../types/message-response.ts";

function ErrorHandlerMiddleware(err: Error, _req: Request, res: Response<MessageResponse>, _next: NextFunction) {

    let customError: CustomAPIError = new CustomAPIError('Something went wrong', 500)

    if (err instanceof CustomAPIError) {
        customError = err
    }
    else if ('code' in err && err.code === 11_000 && 'keyValue' in err && err.keyValue instanceof Object) {
        if (Object.keys(err.keyValue).includes('username')) {
            customError.message = 'This username is already taken';
        }
        else{
            customError.message = `Duplicate value for ${Object.keys(err.keyValue)} field, choose a different one`;
        }
        customError.statusCode = 400;
    }
    
    console.log(err.message);
    res.status(customError.statusCode).json({ message: customError.message });
}

export default ErrorHandlerMiddleware;
