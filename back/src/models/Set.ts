import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must provide a name'],
        maxlength: 30
    },
    description: {
        type: String,
        maxlength: 200
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'You have to provide a user'],
        immutable: true
    },
    creatorName: {
      type: String,
      required: [true, 'You have to provide a user']
    },
    flashcards: {
        type: [{
            question: String,
            answer: String
        }],
        maxlength: 1000,
        required: [true, 'You must provide flashcards']
    },
    likes: {
        type: Number,
        default: 0
    },
    likers: {
        type: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        default: []
    }
}, { timestamps: true });

export default mongoose.model('Set', setSchema);