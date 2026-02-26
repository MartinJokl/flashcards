import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'You must provide a username'],
        minlength: 3,
        maxlength: 30,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'You must provide a password'],
        minlength: 8
    }
});

export default mongoose.model('User', userSchema);