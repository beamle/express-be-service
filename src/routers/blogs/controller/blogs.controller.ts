import { Request, Response } from "express";
import { BlogType } from "../../../app/db";
import {
  RequestWithBody,
  RequestWithRouteParams,
  RequestWithRouteParamsAndBody,
  RoutePathWithIdParam
} from "../../RequestTypes";
import { BlogError, CreateBlogInput, CreateBlogOutput } from "../blogs.types";
import blogsController from "./blogs.controller";
import { blogsRepository } from "../blogs.repository";


class BlogsController {
  async getBlogs(req: Request, res: Response) {
    res.status(200).json(await blogsRepository.getBlogs())
  }

  async createBlog(req: RequestWithBody<CreateBlogInput>, res: Response<CreateBlogOutput | BlogError>) {
    // const errors = createBlogValidation(req)
    // if (errors.errorsMessages.length > 0) {
    //   res.status(400).json(errors.errorsMessages[0])
    //   return
    // }
    const { createdBlog } = await blogsRepository.create(req.body)
    res.status(201).json(createdBlog)
  }

  async getBlogById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response<BlogType | BlogType[] | BlogError>) {
    const { id: searchableBlogId } = req.params

    if (!searchableBlogId) return await blogsController.getBlogs(req, res) // if undefined

    const blog = await blogsRepository.findBy(searchableBlogId)

    if (blog) {
      res.status(200).json(blog)
    }
    // else {
    //   res.status(404).json({ message: 'Blog with such id was not found', field: 'id' })
    // }
  }

  async updateBlog(req: RequestWithRouteParamsAndBody<RoutePathWithIdParam, CreateBlogInput>, res: Response) {
    // const errors = updateBlogValidation(req)
    // if (errors.errorsMessages.length > 0) {
    //   res.status(400).json(errors.errorsMessages[0])
    //   return
    // }
    const updatedBlog = await blogsRepository.updateBlog({...req.body}, String(req.params.id))

    if (!updatedBlog) {
      res.status(404).json({ message: "Blog not found", field: "id" });
      return
    }


    res.sendStatus(204)
  }

  async deleteBlog(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    // const errors = validateDeleteBlog(String(req.params.id))
    // if (errors.errorsMessages.length > 0) {
    //   res.status(400).json(errors.errorsMessages[0])
    //   return
    // }

    const blog = await blogsRepository.delete(req.params.id)

    if (!blog) {
      res.status(404).json({ message: "Blog not found", field: "id" });
      return
    }

    res.sendStatus(204)
  }
}

export default new BlogsController();