import mongoose, { Schema } from 'mongoose';
import { BlogType } from '../../app/db';

export const blogSchema = new Schema<BlogType>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
    id: { type: String } // Keeping id as optional string since it was used in responses
}, {
    // MongoDB automatically generates _id
    versionKey: false // removes __v field
});

export const BlogModel = mongoose.model<BlogType>('blogs', blogSchema);
