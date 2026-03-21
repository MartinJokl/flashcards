import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must provide a name']
    },
    description: {
        type: String
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