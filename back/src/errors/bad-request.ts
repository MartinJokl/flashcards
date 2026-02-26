import CustomAPIError from "./custom.ts";

class BadRequestError extends CustomAPIError {
    constructor(message: string) {
        super(message, 400);
    }
}

export default BadRequestError;