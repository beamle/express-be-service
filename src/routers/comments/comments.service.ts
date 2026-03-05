import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Types } from 'mongoose';
import { CustomError } from '../../helpers/CustomError';
import { CommentsRepository } from './comments.repository';
import { CommentModel, CommentLikeModel } from './comments.schema';

export const CommentsErrors = {
  NO_COMMENTS_FOUND: {
    message: 'Comment with such Id was not found!',
    field: 'id',
    status: 404,
  },
  NOT_OWNER_OF_COMMENT: {
    message: 'You are not owner of the comment',
    field: '',
    status: 403,
  },
};

@injectable()
export class CommentsService {
  constructor(@inject(CommentsRepository) private commentsRepository: CommentsRepository) {
    this.commentsRepository = commentsRepository;
  }
  async updateComment(contentObj: { content: string }, commentId: Types.ObjectId) {
    const result = await this.commentsRepository.updateCommentById(contentObj.content, commentId);

    if (!result) {
      throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND);
    }

    return result;
  }

  async deleteComment(commentId: Types.ObjectId) {
    const result = await this.commentsRepository.deleteCommentById(commentId);

    if (!result) {
      throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND);
    }

    return result;
  }

  async updateLikeStatus(commentId: Types.ObjectId, userId: string, status: string | 'None' | 'Like' | 'Dislike') {
    const comment = await CommentModel.findOne({ _id: commentId }).lean();
    if (!comment) {
      throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND);
    }

    const likeStatusRecord = await CommentLikeModel.findOne({ commentId: commentId.toString(), userId: userId });

    if (!likeStatusRecord) {
      if (status !== 'None') {
        const newLike = new CommentLikeModel({
          commentId: commentId.toString(),
          userId,
          status: status as any,
          addedAt: new Date()
        });
        await newLike.save();
      }
    } else {
      if (status === 'None') {
        await CommentLikeModel.deleteOne({ _id: likeStatusRecord._id });
      } else if (likeStatusRecord.status !== status) {
        likeStatusRecord.status = status as any;
        await likeStatusRecord.save();
      }
    }

    return true;
  }
}
