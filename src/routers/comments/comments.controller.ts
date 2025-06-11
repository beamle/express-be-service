import { RequestWithRouteParams, RoutePathWithIdParam } from "../RequestTypes";
import { Response } from "express";
import { ObjectId } from "mongodb";
import { handleError } from "../../helpers/validationHelpers";
import commentsQueryRepository from "./comments.queryRepository";
import commentsService, { CommentsErrors } from "./comments.service";
import { CustomError } from "../../helpers/CustomError";
import { AuthErrors } from "../auth/controller/auth.controller";

class CommentsController {
  async getCommentById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    const { id: searchableCommentId } = req.params
    try {
      const comment = await commentsQueryRepository.getCommentBy(new ObjectId(searchableCommentId))
      res.status(200).json(comment)
      return
    } catch (e) {
      handleError(res, e)
    }
  }

  async updateCommentForPost(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response): Promise<any> {
    const { id: searchableCommentId } = req.params

    try {
      const comment = await commentsQueryRepository.getCommentBy(new ObjectId(searchableCommentId))
      if (comment.commentatorInfo.userId !== req.context.user?.userId) {
        throw new CustomError(CommentsErrors.NOT_OWNER_OF_COMMENT) // Fine to capture here since CQRS is used
        // return res.status(403).json({ message: "You are not owner of the comment" })
      }

      await commentsService.updateComment({ ...req.body }, new ObjectId(searchableCommentId))
      return res.send(204)
    } catch (error) {
      handleError(res, error)
    }
  }

  async deleteCommentById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response): Promise<any> {
    const { id: commentIdToDelete } = req.params;

    try {
      const comment = await commentsQueryRepository.getCommentBy(new ObjectId(commentIdToDelete))
      if (comment.commentatorInfo.userId !== req.context.user?.userId) {
        throw new CustomError(CommentsErrors.NOT_OWNER_OF_COMMENT)
      }

      const deletingResult = await commentsService.deleteComment(new ObjectId(commentIdToDelete))
      res.status(204).json(deletingResult)
      return

    } catch (e) {
      handleError(res, e)
    }
  }

}

export default new CommentsController();