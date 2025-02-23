import { ObjectId } from "mongodb";
import { commentsCollection } from "../../app/db";

class CommentsRepository {
  async updateCommentById(content: string, commentId: ObjectId): Promise<boolean | number> {
    const comment = await commentsCollection.findOne({ _id: commentId })

    if (!comment) return false
    const resultOfUpdatingComment = await commentsCollection.updateOne(
      { _id: commentId },
      {
        $set: {
          content: content
        }
      })

    return resultOfUpdatingComment.matchedCount;
  }

  async deleteCommentById(commentId: ObjectId) {
    const comment = await commentsCollection.findOne({ _id: commentId })

    if (!comment) {
      return false
    }
    const resultOfDeletingComment = await commentsCollection.deleteOne({ _id: commentId })

    return resultOfDeletingComment.acknowledged
  }
}

export default new CommentsRepository();