import { Types } from 'mongoose';
import 'reflect-metadata';
import { PostsSortingData } from '../../app/db';
import { CustomError } from '../../helpers/CustomError';
import { CommentsErrors } from './comments.service';
import { CommentType } from './comments.types';
import { CommentModel, CommentLikeModel } from './comments.schema';

export class CommentsQueryRepository {
  async getCommentsByPostId(sortingData: PostsSortingData, postId: string, userId?: string): Promise<CommentType[] | boolean> {
    const comments = await CommentModel
      .find({ postId })
      .select('-postId -__v')
      .skip((sortingData.pageNumber - 1) * sortingData.pageSize)
      .limit(sortingData.pageSize)
      .sort({ [sortingData.sortBy]: sortingData.sortDirection === 'asc' ? 1 : -1 })
      .lean();

    if (!comments) return false;

    const mappedComments: CommentType[] = [];
    for (const comment of comments) {
      mappedComments.push(await this.mapToCommentType(comment as unknown as CommentType, userId));
    }

    return mappedComments;
  }

  async getLastCreatedCommentForPostBy(commentId: Types.ObjectId, userId?: string): Promise<CommentType> {
    const comments = await CommentModel.find({ _id: commentId }).lean();
    if (!comments || comments.length === 0) throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND);

    return await this.mapToCommentType(comments[0] as unknown as CommentType, userId);
  }

  async getCommentBy(commentId: Types.ObjectId, userId?: string): Promise<CommentType> {
    const comment = await CommentModel.findOne({ _id: commentId }).lean();
    if (!comment) throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND);

    return await this.mapToCommentType(comment as unknown as CommentType, userId);
  }

  private async mapToCommentType(comment: CommentType, userId?: string) {
    const { postId, _id, ...rest } = comment;

    const likesCount = await CommentLikeModel.countDocuments({ commentId: _id!.toString(), status: 'Like' });
    const dislikesCount = await CommentLikeModel.countDocuments({ commentId: _id!.toString(), status: 'Dislike' });

    let myStatus = 'None';
    if (userId) {
      const userLike = await CommentLikeModel.findOne({ commentId: _id!.toString(), userId }).lean();
      if (userLike) {
        myStatus = userLike.status;
      }
    }

    return {
      ...rest,
      id: _id!.toString(),
      likesInfo: {
        likesCount,
        dislikesCount,
        myStatus
      }
    } as any;
  }
}
