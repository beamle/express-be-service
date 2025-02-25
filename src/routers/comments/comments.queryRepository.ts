import { ObjectId } from "mongodb";
import { commentsCollection } from "../../app/db";
import { CommentType } from "./comments.types";
import { CustomError } from "../../helpers/CustomError";
import { CommentsErrors } from "./comments.service";

class CommentsQueryRepository {
  async getCommentsByPostId(postId: string): Promise<CommentType[] | boolean> {
    const comments = await commentsCollection.find({ postId }, { projection: { postId: 0 } }).toArray();
    if (!comments) return false

    return this.mapCommentsToCommentType(comments)
  }

  async getLastCreatedCommentForPostBy(commentId: ObjectId): Promise<CommentType> {

    const comments = await commentsCollection
      .find({ _id: commentId })
      .toArray()

    if (!comments) {
      throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND)
    }

    return this.mapToCommentType(comments[0])
  }

  async getCommentBy(commentId: ObjectId): Promise<CommentType> {

    const comment = await commentsCollection.findOne({ _id: commentId })

    if (!comment) {
      throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND)
    }

    return this.mapToCommentType(comment)

  }

  private mapCommentsToCommentType(comments) {
    return comments.map(comment => {
      const { _id, ...rest } = comment;
      return { id: _id.toString(), ...rest };
    });
  }

  private mapToCommentType(comment: CommentType) {
    const { postId, _id, ...rest } = comment
    return { ...rest, id: _id }
  }
}

export default new CommentsQueryRepository();