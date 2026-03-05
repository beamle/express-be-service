import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Types } from 'mongoose';
import { CustomError } from '../../helpers/CustomError';
import { CommentsRepository } from './comments.repository';

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
}
