import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

interface IUser extends Document {
    username: string,
    password: string,
    checkPassword: (candidatePassword: string) => boolean,
    createJWT: () => string
}

const userSchema = new mongoose.Schema<IUser>({
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

userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

userSchema.method('checkPassword', async function(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
})

userSchema.method('createJWT', function() {
    const lifetime = '30d';
    return jwt.sign({ userId: this._id}, process.env.JWT_SECRET!, {
        expiresIn: lifetime
    })
})

export default mongoose.model('User', userSchema);