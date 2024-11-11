import { Request, Response } from "express";
import { blogsCollection, postsCollection, PostType } from "../../../app/db";
import { RequestWithRouteParams, RequestWithRouteParamsAndBody, RoutePathWithIdParam } from "../../RequestTypes";
import { PostError, UpdatePostInput } from "../posts.types";
import { ObjectId, SortDirection } from "mongodb";
import postsService, { CustomError, PostErrors } from "../posts.service";


class PostsController {
  async getPosts(req: Request, res: Response) {
    const { blogId } = req.params
    let pageNumber =  req.query.pageNumber ? Number(req.query.pageNumber) : 1
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt'
    let sortDirection: SortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc'

    try {
      const posts = blogId
        ? await postsService.getPosts({ pageNumber, pageSize, sortBy, sortDirection}, new ObjectId(blogId))
        : await postsService.getPosts({ pageNumber, pageSize, sortBy, sortDirection})

      const postsLength = await postsCollection.countDocuments(blogId ? { blogId: blogId.toString() } : {})

      res.status(200).json({
        pagesCount: Math.ceil(postsLength / pageSize),
        page: pageNumber,
        pageSize,
        totalCount: postsLength,
        items: posts})
      return
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message, field: error.field });
        return
      } else {
        res.status(500).json(PostErrors.INTERNAL_SERVER_ERROR);
        return
      }
    }
  }

  //https://stackoverflow.com/questions/59117885/handling-errors-in-express-js-in-service-controller-layers
  //https://github.com/goldbergyoni/nodebestpractices

  // async createPost(req: RequestWithRouteParamsAndBody<CreatePostInput, blogId>, res: Response<PostType | PostError>) {
  async createPost(req: Request, res: Response<PostType | PostError>) {
    const { blogId } = req.params
    debugger
    try {
      let createdPost;
      if(blogId) {
        createdPost = await postsService.createPostForBlog(req.body, blogId)
      } else {
        createdPost = await postsService.createPost(req.body)
      }
      res.status(201).json(createdPost)
      return
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message, field: error.field });
        return
      } else {
        res.status(500).json(PostErrors.INTERNAL_SERVER_ERROR);
        return
      }
    }
  }

  async getPostById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response<PostType | PostType[] | PostError>) {
    const { id: searchablePostId } = req.params
    let pageNumber =  req.query.pageNumber ? Number(req.query.pageNumber) : 1
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt'
    let sortDirection: SortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc'

    if (!searchablePostId) { // if undefined
      try {
        const posts = await postsService.getPosts({ pageNumber, pageSize, sortBy, sortDirection})
        res.status(200).json(posts)
      } catch (error) {
        if (error instanceof CustomError) {
          res.status(error.status).json({ message: error.message, field: error.field });
          return
        } else {
          res.status(500).json(PostErrors.INTERNAL_SERVER_ERROR);
          return
        }
      }
    }

    try {
      const post = await postsService.getPostById(new ObjectId(searchablePostId))
      res.status(200).json(post)
      return
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message, field: error.field });
        return
      } else {
        res.status(500).json(PostErrors.INTERNAL_SERVER_ERROR);
        return
      }
    }
  }

  async updatePost(req: RequestWithRouteParamsAndBody<RoutePathWithIdParam, UpdatePostInput>, res: Response) {
    try {
      const postIdUpdated = await postsService.updatePost({ ...req.body }, new ObjectId(req.params.id))
      res.sendStatus(204)
      return

    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message, field: error.field });
        return
      } else {
        res.status(500).json(PostErrors.INTERNAL_SERVER_ERROR);
        return
      }
    }
  }

  async deletePost(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    try {
      const postIsDeleted = await postsService.deletePost(new ObjectId(req.params.id))
      res.sendStatus(204)
      return

    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message, field: error.field });
        return
      } else {
        res.status(500).json(PostErrors.INTERNAL_SERVER_ERROR);
        return
      }
    }
  }
}

export default new PostsController();