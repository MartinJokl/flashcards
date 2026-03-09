import mongoose from "mongoose";

async function connectDB(uri: string): Promise<mongoose.Mongoose> {
    return mongoose.connect(uri);
}

export default connectDB;