import { ObjectId } from "mongodb";
import { PostErrors } from "../posts/posts.service";
import { CustomError } from "../../helpers/CustomError";
import commentsRepository from "./comments.repository";
import { Comment, CommentType } from "./comments.types";

export const CommentsErrors = {
  NO_COMMENTS_FOUND: { message: "Comment with such Id was not found!", field: "id", status: 404 },
}

class CommentsService {
  async updateComment(content: string, commentId: ObjectId) {
    const result = await commentsRepository.updateCommentById(content, commentId)

    if(!result) {
      throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND)
    }

    return result
  }

  async deleteComment(commentId: ObjectId) {
    const result = await commentsRepository.deleteCommentById(commentId);

    if(!result) {
      throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND)
    }

    return result
  }
}

export default new CommentsService()