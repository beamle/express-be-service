import mongoose, { Schema } from 'mongoose';
import { CommentDBType, CommentLikeDBType } from '../../app/db';
import { LikeStatus } from '../../app/LikeStatus';

export const commentSchema = new Schema<CommentDBType>({
    postId: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true }
    },
    createdAt: { type: String, required: true },
    id: { type: Schema.Types.Mixed }
}, {
    versionKey: false
});

export const CommentModel = mongoose.model<CommentDBType>('comments', commentSchema);

export const commentLikeSchema = new Schema<CommentLikeDBType>({
    userId: { type: String, required: true },
    commentId: { type: String, required: true },
    status: { type: String, enum: ['None', 'Like', 'Dislike'], required: true },
    addedAt: { type: Date, required: true }
}, {
    versionKey: false
});

export const CommentLikeModel = mongoose.model<CommentLikeDBType>('comment-likes', commentLikeSchema);
