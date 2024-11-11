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

function generateSortingDataObject(req: Request) {
  let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1
  let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
  let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt'
  let sortDirection: SortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc'
  let searchNameTerm = req.query.searchNameTerm ? String(req.query.searchNameTerm) : null
  return { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm }
}

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
    const blogs = await blogsService.getBlogs(sortingData)

    res.status(200).json({
      pagesCount: Math.ceil(blogs.totalCount / sortingData.pageSize),
      page: sortingData.pageNumber,
      pageSize: sortingData.pageSize,
      totalCount: blogs.totalCount,
      items: blogs.blogs })
    return
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
      return await blogsController.getBlogs(req, res) // if undefined
    }

    try {
      const blog = await blogsService.getBlogById(new ObjectId(searchableBlogId))
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