import { RequestWithRouteParams, RoutePathWithIdParam } from "../RequestTypes";
import { Response } from "express";
import { ObjectId, SortDirection } from "mongodb";
import postsQueryRepository from "../posts/posts.queryRepository";
import { handleError } from "../../helpers/validationHelpers";
import commentsQueryRepository from "./comments.queryRepository";
import commentsService from "./comments.service";

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

  async deleteCommentById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    const { id: commentIdToDelete } = req.params;

    try {
      const comment = await commentsService.deleteComment(new ObjectId(commentIdToDelete))
      res.status(200).json(comment)
      return
    } catch (e) {
      handleError(res, e)
    }
  }

}

export default new CommentsController();