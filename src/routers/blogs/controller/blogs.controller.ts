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
import { ObjectId, SortDirection } from "mongodb";
import blogsService from "../blogs.service";
import { CustomError, PostErrors } from "../../posts_/posts.service";
import blogsQueryRepository from "../blogs.queryRepository";
import BlogsQueryRepository from "../blogs.queryRepository";
import { generateSortingDataObject } from "../../../helpers/objectGenerators";

function handleError(res: Response, error: any) {
  if (error.constructor.name === 'CustomError') {
    res.status(error.status).json({ message: error.message, field: error.field });
    return
  } else {
    res.status(500).json(PostErrors.INTERNAL_SERVER_ERROR);
    return
  }
}

class BlogsController {
  async getBlogs(req: Request, res: Response) {

    const sortingData = generateSortingDataObject(req)
    try {
      const blogs = await blogsQueryRepository.getBlogs(sortingData)
      res.status(200).json(blogs)
      return
    } catch (error) {
      handleError(res, error)
    }
  }

  async createBlog(req: RequestWithBody<CreateBlogInput>, res: Response<CreateBlogOutput | BlogError>) {
    try {
      const createdBlog = await blogsService.createBlog({ ...req.body })
      res.status(201).json(createdBlog)
      return
    } catch (error) {
      handleError(res, error)
    }
  }

  async getBlogById(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response<BlogType | BlogType[] | BlogError>) {
    const { id: searchableBlogId } = req.params
    if (!searchableBlogId) {
      return await blogsController.getBlogs(req, res)
    }

    try {
      const blog = await BlogsQueryRepository.getBlogById(searchableBlogId)
      res.status(200).json(blog)
      return
    } catch (error) {
      handleError(res, error)
    }
  }

  async updateBlog(req: RequestWithRouteParamsAndBody<RoutePathWithIdParam, CreateBlogInput>, res: Response) {
    try {
      const updatedBlog = await blogsService.updateBlog({ ...req.body }, new ObjectId(req.params.id))
      res.sendStatus(204)
      return
    } catch (error) {
      handleError(res, error)
    }
  }

  async deleteBlog(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    try {
      const blog = await blogsService.deleteBlog(new ObjectId(req.params.id))
      res.sendStatus(204)
    } catch (error) {
      handleError(res, error)
    }
  }
}

export default new BlogsController();