import { Request, Response } from "express";
import { PostType } from "../../../app/db";
import { RequestWithRouteParams, RequestWithRouteParamsAndBody, RoutePathWithIdParam } from "../../RequestTypes";
import { PostError, UpdatePostInput } from "../posts.types";
import { ObjectId, SortDirection } from "mongodb";
import postsService, { PostErrors } from "../posts.service";
import postsQueryRepository from "../posts.queryRepository";
import { handleError } from "../../../helpers/validationHelpers";
import { blogsRepository } from "../../blogs/blogs.repository";
import { CustomError } from "../../../helpers/CustomError";
import commentsQueryRepository from "../../comments/comments.queryRepository";

//https://stackoverflow.com/questions/59117885/handling-errors-in-express-js-in-service-controller-layers
//https://github.com/goldbergyoni/nodebestpractices

class PostsController {
  async getPosts(req: Request, res: Response) {
    const { blogId } = req.params
    let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt'
    let sortDirection: SortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc'
    try {
      if (blogId) {
        const blog = await blogsRepository.findBy(new ObjectId(blogId)) // TODO: change to blogsQueryRepository

        if (!blog) {
          throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID)
        }
      }
      const posts = await postsQueryRepository.getPosts({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
      }, blogId ? new ObjectId(blogId) : undefined)
      res.status(200).json(posts)

    } catch (error) {
      handleError(res, error)
    }
  }

  async createPost(req: Request, res: Response<PostType | PostError>) {
    const { blogId } = req.params
    try {
      let createdPost;
      if (blogId) {
        createdPost = await postsService.createPostForBlog(req.body, blogId)
      } else {
        createdPost = await postsService.createPost(req.body)
      }
      res.status(201).json(createdPost)
      return
    } catch (error) {
      handleError(res, error)
    }
  }

  async getPostById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    const { id: searchablePostId } = req.params
    let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt'
    let sortDirection: SortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc'

    if (!searchablePostId) {
      try {
        const posts = await postsQueryRepository.getPosts({
          pageNumber,
          pageSize,
          sortBy,
          sortDirection
        }, new ObjectId(searchablePostId))
        res.status(200).json(posts)
      } catch (e) {
        handleError(res, e)
      }
    }

    try {
      const post = await postsQueryRepository.getPostById(new ObjectId(searchablePostId))
      res.status(200).json(post)
      return
    } catch (e) {
      handleError(res, e)
    }
  }

  async updatePost(req: RequestWithRouteParamsAndBody<RoutePathWithIdParam, UpdatePostInput>, res: Response) {
    try {
      const postIdUpdated = await postsService.updatePost({ ...req.body }, new ObjectId(req.params.id))
      res.sendStatus(204)
      return

    } catch (e) {
      handleError(res, e)
    }
  }

  async deletePost(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    try {
      const postIsDeleted = await postsService.deletePost(new ObjectId(req.params.id))
      res.sendStatus(204)
      return

    } catch (e) {
      handleError(res, e)
    }
  }

  async createCommentForPost(req: RequestWithRouteParamsAndBody<{ postId: string }, {
    context: string
  }>, res: Response) {
    const { postId } = req.params
    const { content } = req.body
    const { userId, login } = req.context.user

    try {
      const post = await postsQueryRepository.getPostById(new ObjectId(postId))
      const createdCommentId = await postsService.createCommentForPost(new ObjectId(post.id!), {
        userId,
        userLogin: login
      }, content)
      const createdComment = await commentsQueryRepository.getLastCreatedCommentForPostBy(new ObjectId(createdCommentId))

      res.status(201).json(createdComment)
      return
    } catch (e) {
      handleError(res, e)
    }
  }

  async getCommentsByPostId(req: Request, res: Response) {
    const { postId } = req.params

    let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt'
    let sortDirection: SortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc'

    try {
      const post = await postsQueryRepository.getPostById(new ObjectId(postId))
      let comments;
      if (post) {
        comments = await postsQueryRepository.getPostCommentsByPostId({
          pageNumber,
          pageSize,
          sortBy,
          sortDirection
        }, new ObjectId(postId))
      }

      res.status(200).json(comments)
      return
    } catch (e) {
      handleError(res, e)
    }
  }
}

export default new PostsController();