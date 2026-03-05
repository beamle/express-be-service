import { ObjectId } from 'mongodb';
import 'reflect-metadata';
import { PostsSortingData } from '../../app/db';
import { CustomError } from '../../helpers/CustomError';
import { CommentsErrors } from './comments.service';
import { CommentType } from './comments.types';
import { CommentModel } from './comments.schema';

export class CommentsQueryRepository {
  async getCommentsByPostId(sortingData: PostsSortingData, postId: string): Promise<CommentType[] | boolean> {
    const comments = await CommentModel
      .find({ postId })
      .select('-postId -__v')
      .skip((sortingData.pageNumber - 1) * sortingData.pageSize)
      .limit(sortingData.pageSize)
      .sort({ [sortingData.sortBy]: sortingData.sortDirection === 'asc' ? 1 : -1 })
      .lean();

    if (!comments) return false;

    return this.mapCommentsToCommentType(comments as unknown as CommentType[]);
  }

  async getLastCreatedCommentForPostBy(commentId: ObjectId): Promise<CommentType> {
    const comments = await CommentModel.find({ _id: commentId }).lean();
    if (!comments || comments.length === 0) throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND);

    return this.mapToCommentType(comments[0] as unknown as CommentType);
  }

  async getCommentBy(commentId: ObjectId): Promise<CommentType> {
    const comment = await CommentModel.findOne({ _id: commentId }).lean();
    if (!comment) throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND);

    return this.mapToCommentType(comment as unknown as CommentType);
  }

  private mapCommentsToCommentType(comments: CommentType[]) {
    return comments.map((comment) => {
      const { _id, ...rest } = comment;
      return { ...rest, id: _id!.toString() };
    });
  }

  private mapToCommentType(comment: CommentType) {
    const { postId, _id, ...rest } = comment;
    return { ...rest, id: _id };
  }
}
