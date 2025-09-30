import { ObjectId } from "mongodb";
import { CustomError } from "../../helpers/CustomError";
import commentsRepository from "./comments.repository";

export const CommentsErrors = {
  NO_COMMENTS_FOUND: {
    message: "Comment with such Id was not found!",
    field: "id",
    status: 404,
  },
  NOT_OWNER_OF_COMMENT: {
    message: "You are not owner of the comment",
    field: "",
    status: 403,
  },
};

class CommentsService {
  async updateComment(contentObj: { content: string }, commentId: ObjectId) {
    const result = await commentsRepository.updateCommentById(
      contentObj.content,
      commentId
    );

    if (!result) {
      throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND);
    }

    return result;
  }

  async deleteComment(commentId: ObjectId) {
    const result = await commentsRepository.deleteCommentById(commentId);

    if (!result) {
      throw new CustomError(CommentsErrors.NO_COMMENTS_FOUND);
    }

    return result;
  }
}

export default new CommentsService();
