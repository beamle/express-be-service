import { Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Types } from 'mongoose';
import { CustomError } from '../../helpers/CustomError';
import { handleError } from '../../helpers/validationHelpers';
import { RequestWithRouteParams, RoutePathWithIdParam } from '../RequestTypes';
import { CommentsQueryRepository } from './comments.queryRepository';
import { CommentsErrors, CommentsService } from './comments.service';
@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService) private commentsService: CommentsService,
    @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
  ) {
    this.commentsService = commentsService;
    this.commentsQueryRepository = commentsQueryRepository;
  }
  async getCommentById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    const { id: searchableCommentId } = req.params;
    const userId = req.context?.user?.userId;
    try {
      const comment = await this.commentsQueryRepository.getCommentBy(new Types.ObjectId(searchableCommentId), userId);
      res.status(200).json(comment);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async updateCommentForPost(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response): Promise<any> {
    const { id: searchableCommentId } = req.params;

    try {
      const comment = await this.commentsQueryRepository.getCommentBy(new Types.ObjectId(searchableCommentId));
      if (comment.commentatorInfo.userId !== req.context.user?.userId) {
        throw new CustomError(CommentsErrors.NOT_OWNER_OF_COMMENT); // Fine to capture here since CQRS is used
        // return res.status(403).json({ message: "You are not owner of the comment" })
      }

      await this.commentsService.updateComment({ ...req.body }, new Types.ObjectId(searchableCommentId));
      return res.send(204);
    } catch (error) {
      handleError(res, error);
    }
  }

  async deleteCommentById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response): Promise<any> {
    const { id: commentIdToDelete } = req.params;

    try {
      const comment = await this.commentsQueryRepository.getCommentBy(new Types.ObjectId(commentIdToDelete));
      if (comment.commentatorInfo.userId !== req.context.user?.userId) {
        throw new CustomError(CommentsErrors.NOT_OWNER_OF_COMMENT);
      }

      const deletingResult = await this.commentsService.deleteComment(new Types.ObjectId(commentIdToDelete));
      res.status(204).json(deletingResult);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async updateCommentLikeStatus(req: RequestWithRouteParams<{ id: string }>, res: Response): Promise<any> {
    const { id: commentId } = req.params;
    const { likeStatus } = req.body;
    const userId = req.context.user?.userId;

    try {
      await this.commentsService.updateLikeStatus(new Types.ObjectId(commentId), userId!, likeStatus);
      res.sendStatus(204);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }
}
