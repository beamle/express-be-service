import mongoose, { Schema } from 'mongoose';
import { PostLikeDBType, PostType } from '../../app/db';

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

export const postLikeSchema = new Schema<PostLikeDBType>({
    userId: { type: String, required: true },
    login: { type: String, required: true },
    postId: { type: String, required: true },
    status: { type: String, required: true },
    addedAt: { type: Date, required: true }
}, {
    versionKey: false
});

export const PostLikeModel = mongoose.model<PostLikeDBType>('postLikes', postLikeSchema);
