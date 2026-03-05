import mongoose, { Schema } from 'mongoose';
import { UserSessionDBType, RefreshTokenDBType } from '../../app/db';

export const sessionSchema = new Schema<UserSessionDBType>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    lastActiveDate: { type: Date, required: true },
    title: { type: String, required: true },
}, {
    versionKey: false
});

export const SessionModel = mongoose.model<UserSessionDBType>('sessions', sessionSchema);


export const refreshTokenBlacklistSchema = new Schema<RefreshTokenDBType>({
    refreshToken: { type: String, required: true },
    id: { type: Schema.Types.Mixed }
}, {
    versionKey: false
});

export const RefreshTokenBlacklistModel = mongoose.model<RefreshTokenDBType>('refresh-token-blacklist', refreshTokenBlacklistSchema);
