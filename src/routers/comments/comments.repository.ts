import { Types } from 'mongoose';
import 'reflect-metadata';
import { CommentModel } from './comments.schema';

export class CommentsRepository {
  async updateCommentById(content: string, commentId: Types.ObjectId): Promise<boolean | number> {
    const comment = await CommentModel.findOne({ _id: commentId }).lean();

    if (!comment) return false;
    const resultOfUpdatingComment = await CommentModel.updateOne(
      { _id: commentId },
      {
        $set: {
          content: content,
        },
      },
    );

    return resultOfUpdatingComment.matchedCount;
  }

  async deleteCommentById(commentId: Types.ObjectId) {
    const comment = await CommentModel.findOne({ _id: commentId }).lean();

    if (!comment) {
      return false;
    }
    const resultOfDeletingComment = await CommentModel.deleteOne({ _id: commentId });

    return resultOfDeletingComment.deletedCount > 0;
  }
}
