import mongoose from "mongoose";

async function connectDB(uri: string) {
    return mongoose.connect(uri);
}

export default connectDB;