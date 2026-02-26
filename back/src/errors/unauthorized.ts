import CustomAPIError from "./custom.ts";

class UnauthorizedError extends CustomAPIError {
    constructor(message: string) {
        super(message, 401);
    }
}

export default UnauthorizedError;