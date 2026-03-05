import mongoose, { Schema } from 'mongoose';
import { RequestCasesMetadataDBType } from '../../app/db';

export const requestCasesSchema = new Schema<RequestCasesMetadataDBType>({
    IP: { type: String, required: true },
    baseURL: { type: String, required: true },
    date: { type: Date, required: true },
}, {
    versionKey: false
});

export const RequestCasesModel = mongoose.model<RequestCasesMetadataDBType>('request-cases', requestCasesSchema);
