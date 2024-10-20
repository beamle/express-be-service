import { Request, Response } from "express";
import { PostType } from "../../../app/db";
import {
  RequestWithBody,
  RequestWithRouteParams,
  RequestWithRouteParamsAndBody,
  RoutePathWithIdParam
} from "../../RequestTypes";
import { CreatePostInput, CreatePostOutput, PostError, UpdatePostInput } from "../posts.types";
import postsController from "./posts.controller";
import { postsRepository } from "../posts.repository";


class PostsController {
  async getPosts(req: Request, res: Response) {
    res.status(200).json(await postsRepository.getPosts())
  }

  async createPost(req: RequestWithBody<CreatePostInput>, res: Response<CreatePostOutput | PostError>) {
    const { createdPost } = await postsRepository.create(req.body)

    res.status(201).json(createdPost)
  }

  async getPostById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response<PostType | PostType[] | PostError>) {
    const { id: searchablePostId } = req.params

    if (!searchablePostId) return await postsController.getPosts(req, res) // if undefined

    const post = await postsRepository.findBy(searchablePostId)

    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: 'Post with such id was not found', field: 'id' })
    }
  }

  async updatePost(req: RequestWithRouteParamsAndBody<RoutePathWithIdParam, UpdatePostInput>, res: Response) {
    const updatedPost = await postsRepository.updatePost({ ...req.body }, String(req.params.id))

    if (!updatedPost) {
      res.status(404).json({ message: "Post not found", field: "id" });
      return
    }


    res.sendStatus(204)
  }

  async deletePost(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    const post = await postsRepository.delete(req.params.id)

    if (!post) {
      res.status(404).json({ message: "Post not found", field: "id" });
      return
    }

    res.sendStatus(204)
  }
}

export default new PostsController();