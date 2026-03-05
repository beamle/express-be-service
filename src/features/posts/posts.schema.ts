import mongoose, { Schema } from 'mongoose';
import { PostType } from '../../app/db';

export const postSchema = new Schema<PostType>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    id: { type: String }
}, {
    versionKey: false
});

export const PostModel = mongoose.model<PostType>('posts', postSchema);
