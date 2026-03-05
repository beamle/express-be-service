import { Request, Response } from 'express'; import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { SortDirection } from 'mongodb';
import { Types } from 'mongoose';
import { PostType } from '../../app/db';
import { CustomError } from '../../helpers/CustomError';
import { handleError } from '../../helpers/validationHelpers';
import { BlogsRepository } from '../blogs/blogs.repository';
import { CommentsQueryRepository } from '../comments/comments.queryRepository';
import { RequestWithRouteParams, RequestWithRouteParamsAndBody, RoutePathWithIdParam } from '../../common/types/RequestTypes';
import { PostErrors, PostsService } from './posts.service';
import { PostError, UpdatePostInput } from './posts.types';
import { PostsQueryRepository } from './posts.queryRepository';

//https://stackoverflow.com/questions/59117885/handling-errors-in-express-js-in-service-controller-layers
//https://github.com/goldbergyoni/nodebestpractices

// TODO: na vse testy chto padajut, dobavitj middleware, kotoryj budet bratj accessToken

@injectable()
export class PostsController {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
    @inject(PostsService) private postsService: PostsService,
    @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
    @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
  ) {
    this.blogsRepository = blogsRepository;
    this.postsService = postsService;
    this.postsQueryRepository = postsQueryRepository;
    this.commentsQueryRepository = commentsQueryRepository;
  }
  async getPosts(req: Request, res: Response) {
    const { blogId } = req.params;
    let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt';
    let sortDirection: SortDirection =
      req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc';
    try {
      if (blogId) {
        const blog = await this.blogsRepository.findBy(new Types.ObjectId(blogId)); // TODO: change to blogsQueryRepository

        if (!blog) {
          throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID);
        }
      }
      const posts = await this.postsQueryRepository.getPosts(
        {
          pageNumber,
          pageSize,
          sortBy,
          sortDirection,
        },
        blogId ? new Types.ObjectId(blogId) : undefined,
      );
      res.status(200).json(posts);
    } catch (error) {
      handleError(res, error);
    }
  }

  async createPost(req: Request, res: Response<PostType | PostError>) {
    const { blogId } = req.params;
    try {
      let createdPost;
      if (blogId) {
        createdPost = await this.postsService.createPostForBlog(req.body, blogId);
      } else {
        createdPost = await this.postsService.createPost(req.body);
      }
      res.status(201).json(createdPost);
      return;
    } catch (error) {
      handleError(res, error);
    }
  }

  async getPostById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    const { id: searchablePostId } = req.params;
    let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt';
    let sortDirection: SortDirection =
      req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc';

    if (!searchablePostId) {
      try {
        const posts = await this.postsQueryRepository.getPosts(
          {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
          },
          new Types.ObjectId(searchablePostId),
        );
        res.status(200).json(posts);
      } catch (e) {
        handleError(res, e);
      }
    }

    try {
      const post = await this.postsQueryRepository.getPostById(new Types.ObjectId(searchablePostId));
      res.status(200).json(post);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async updatePost(req: RequestWithRouteParamsAndBody<RoutePathWithIdParam, UpdatePostInput>, res: Response) {
    try {
      const postIdUpdated = await this.postsService.updatePost({ ...req.body }, new Types.ObjectId(req.params.id));
      res.sendStatus(204);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async deletePost(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    try {
      const postIsDeleted = await this.postsService.deletePost(new Types.ObjectId(req.params.id));
      res.sendStatus(204);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async createCommentForPost(
    req: RequestWithRouteParamsAndBody<
      { postId: string },
      {
        context: string;
        content: string;
      }
    >,
    res: Response,
  ) {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId, login } = req.context.user!;

    try {
      const post = await this.postsQueryRepository.getPostById(new Types.ObjectId(postId));
      const createdCommentId = await this.postsService.createCommentForPost(
        new Types.ObjectId(post.id!),
        {
          userId,
          userLogin: login,
        },
        content,
      );
      const createdComment = await this.commentsQueryRepository.getLastCreatedCommentForPostBy(
        new Types.ObjectId(createdCommentId),
      );

      res.status(201).json(createdComment);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async getCommentsByPostId(req: Request, res: Response) {
    const { postId } = req.params;

    let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt';
    let sortDirection: SortDirection =
      req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc';

    try {
      const post = await this.postsQueryRepository.getPostById(new Types.ObjectId(postId));
      let comments;
      const userId = req.context?.user?.userId;
      if (post) {
        comments = await this.postsQueryRepository.getPostCommentsByPostId(
          {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
          },
          new Types.ObjectId(postId),
          userId
        );
      }

      res.status(200).json(comments);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }
}
