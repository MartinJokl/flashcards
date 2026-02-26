type User = {
    _id: string;
    username: string;
};

declare namespace Express {
    interface Request {
        user?: User;
    }
}