import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

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
}, {
    methods: {
        async checkPassword(candidatePassword: string) {
            return await bcrypt.compare(candidatePassword, this.password);
        },
        createJWT() {
            const lifetime = '30d';
            return jwt.sign({ userId: this._id}, process.env.JWT_SECRET!, {
                expiresIn: lifetime
            });
        }
    }
});

userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

export default mongoose.model('User', userSchema);