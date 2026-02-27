import mongoose from "mongoose";
/*
const flashcardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'You have to provide a question']
    },
    answer: {
        type: String,
        required: [true, 'You have to provide an answer']
    }
});*/

const setSchema = new mongoose.Schema({
    likes: {
        type: Number,
        default: 0
    },
    flashcards: {
        type: [{
            question: String,
            answer: String
        }],
        required: [true, 'You must provide flashcards']
    },
    name: {
        type: String,
        required: [true, 'You must provide a name']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'You have to provide a user']
    }
});

export default mongoose.model('Set', setSchema);