import { ObjectId } from "mongodb";
import { commentsCollection, postsCollection } from "../../app/db";

class CommentsRepository {
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