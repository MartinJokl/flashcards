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
    name: {
        type: String,
        required: [true, 'You must provide a name'],
        minlength: 3,
        maxlength: 30
    },
    description: {
        type: String,
        maxlength: 200
    },
    likes: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'You have to provide a user'],
        immutable: true
    },
    flashcards: {
        type: [{
            question: String,
            answer: String
        }],
        maxlength: 1000,
        required: [true, 'You must provide flashcards']
    }
}, { timestamps: true });

export default mongoose.model('Set', setSchema);