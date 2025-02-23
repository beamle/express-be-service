import { RequestWithRouteParams, RoutePathWithIdParam } from "../RequestTypes";
import { Response } from "express";
import { ObjectId } from "mongodb";
import { handleError } from "../../helpers/validationHelpers";
import commentsQueryRepository from "./comments.queryRepository";
import commentsService from "./comments.service";
import authQueryRepository from "../auth/auth.queryRepository";

class CommentsController {
  async getCommentById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    const { id: searchableCommentId } = req.params
    // if (!searchableCommentId) {
    //   try {
    //     const posts = await postsQueryRepository.getPosts({
    //       pageNumber,
    //       pageSize,
    //       sortBy,
    //       sortDirection
    //     }, new ObjectId(searchablePostId))
    //     res.status(200).json(posts)
    //   } catch (e) {
    //     handleError(res, e)
    //   }
    // }
    try {
      const comment = await commentsQueryRepository.getCommentBy(new ObjectId(searchableCommentId))
      res.status(200).json(comment)
      return
    } catch (e) {
      handleError(res, e)
    }
  }

  async updateCommentForPost(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    const { id: searchableCommentId } = req.params

    debugger

    try {
      const comment = await commentsQueryRepository.getCommentBy(new ObjectId(searchableCommentId))
      // const me = await authQueryRepository.getMeBy(req.context.user)
      if (comment.commentatorInfo.userId !== req.context.user?.userId) {
        return res.status(403).json({ message: "You are not owner of the comment" })
      }
      const isCommentUpdated = await commentsService.updateComment({ ...req.body }, new ObjectId(searchableCommentId))

      if (isCommentUpdated) res.sendStatus(204)

      return
    } catch (error) {
      handleError(res, error)
    }
  }

  async deleteCommentById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    const { id: commentIdToDelete } = req.params;

    try {
      const comment = await commentsService.deleteComment(new ObjectId(commentIdToDelete))
      res.status(204).json(comment)
      return
    } catch (e) {
      handleError(res, e)
    }
  }

}

export default new CommentsController();