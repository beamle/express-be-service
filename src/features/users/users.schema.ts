import mongoose, { Schema } from 'mongoose';
import { UserType } from '../../app/db';

export const userSchema = new Schema<UserType>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: {
        isConfirmed: { type: Boolean, required: true },
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true }
    },
    id: { type: Schema.Types.Mixed }
}, {
    versionKey: false
});

export const UserModel = mongoose.model<UserType>('users', userSchema);
