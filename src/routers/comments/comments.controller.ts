import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { CustomError } from '../../helpers/CustomError';
import { handleError } from '../../helpers/validationHelpers';
import { RequestWithRouteParams, RoutePathWithIdParam } from '../RequestTypes';
import commentsQueryRepository from './comments.queryRepository';
import { CommentsErrors, CommentsService } from './comments.service';

export class CommentsController {
  private commentsService: CommentsService;
  constructor() {
    this.commentsService = new CommentsService();
  }
  async getCommentById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    const { id: searchableCommentId } = req.params;
    try {
      const comment = await commentsQueryRepository.getCommentBy(new ObjectId(searchableCommentId));
      res.status(200).json(comment);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async updateCommentForPost(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response): Promise<any> {
    const { id: searchableCommentId } = req.params;

    try {
      const comment = await commentsQueryRepository.getCommentBy(new ObjectId(searchableCommentId));
      if (comment.commentatorInfo.userId !== req.context.user?.userId) {
        throw new CustomError(CommentsErrors.NOT_OWNER_OF_COMMENT); // Fine to capture here since CQRS is used
        // return res.status(403).json({ message: "You are not owner of the comment" })
      }

      await this.commentsService.updateComment({ ...req.body }, new ObjectId(searchableCommentId));
      return res.send(204);
    } catch (error) {
      handleError(res, error);
    }
  }

  async deleteCommentById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response): Promise<any> {
    const { id: commentIdToDelete } = req.params;

    try {
      const comment = await commentsQueryRepository.getCommentBy(new ObjectId(commentIdToDelete));
      if (comment.commentatorInfo.userId !== req.context.user?.userId) {
        throw new CustomError(CommentsErrors.NOT_OWNER_OF_COMMENT);
      }

      const deletingResult = await this.commentsService.deleteComment(new ObjectId(commentIdToDelete));
      res.status(204).json(deletingResult);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }
}
