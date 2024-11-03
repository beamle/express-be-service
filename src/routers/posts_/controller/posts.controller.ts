import { Request, Response } from "express";
import { PostType } from "../../../app/db";
import {
  RequestWithBody,
  RequestWithRouteParams,
  RequestWithRouteParamsAndBody,
  RoutePathWithIdParam
} from "../../RequestTypes";
import { CreatePostInput, PostError, UpdatePostInput } from "../posts.types";
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
        ? await postsService.getPostsByBlogId(new ObjectId(blogId), { pageNumber, pageSize, sortBy, sortDirection})
        : await postsService.getPosts({ pageNumber, pageSize, sortBy, sortDirection})
      res.status(200).json(posts)
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

  async createPost(req: RequestWithBody<CreatePostInput>, res: Response<PostType | PostError>) {
    const { blogId } = req.params
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

    if (!searchablePostId) { // if undefined
      try {
        const posts = await postsService.getPosts()
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