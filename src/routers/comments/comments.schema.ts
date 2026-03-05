import mongoose, { Schema } from 'mongoose';
import { CommentDBType } from '../../app/db';

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
