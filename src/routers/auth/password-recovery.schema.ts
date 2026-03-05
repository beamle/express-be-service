import mongoose, { Schema } from 'mongoose';
import { PasswordRecoveryType } from './password-recovery.types';

export const passwordRecoverySchema = new Schema<PasswordRecoveryType>({
    email: { type: String, required: true },
    recoveryCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
}, {
    versionKey: false
});

export const PasswordRecoveryModel = mongoose.model<PasswordRecoveryType>('password-recovery', passwordRecoverySchema);
