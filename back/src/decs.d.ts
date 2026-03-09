type UserReqType = {
    id: string;
    username: string;
};

declare namespace Express {
    interface Request {
        user?: UserReqType;
    }
}