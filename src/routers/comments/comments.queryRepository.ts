import { ObjectId } from "mongodb";
import { commentsCollection } from "../../app/db";
import { CommentType } from "./comments.types";
import { CustomError } from "../../helpers/CustomError";
import { CommentsErrors } from "./comments.service";

class CommentsQueryRepository {
  async getLastCreatedCommentForPostBy(commentId: ObjectId): Promise<CommentType> {

    const comments = await commentsCollection
      .find({ _id: commentId })
      .toArray()

    if(!comments) {
      throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND)
    }

    return this.mapToCommentType(comments[0])
  }

  private mapToCommentType(comment: CommentType) {
    const { postId, _id, ...rest } = comment
    return { ...rest, id: _id }
  }
}

export default new CommentsQueryRepository();