import CustomAPIError from "./custom.ts";

class NotFoundError extends CustomAPIError {
    constructor(message: string) {
        super(message, 404);
    }
}

export default NotFoundError;