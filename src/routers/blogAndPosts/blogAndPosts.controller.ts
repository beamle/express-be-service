import { Request, Response } from "express";
import { postsRepository } from "../posts_/posts.repository";


class BlogAndPostsController {
  async getAllPostsByBlog(req: Request, res: Response) {
    res.status(200).json(await postsRepository.getPosts())
  }

}

export default new BlogAndPostsController();