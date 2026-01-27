import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { BlogType } from '../../../app/db';
import { generateSortingDataObject } from '../../../helpers/objectGenerators';
import { handleError } from '../../../helpers/validationHelpers';
import {
  RequestWithBody,
  RequestWithRouteParams,
  RequestWithRouteParamsAndBody,
  RoutePathWithIdParam,
} from '../../RequestTypes';
import { BlogsQueryRepository } from '../blogs.queryRepository';
import { BlogsService } from '../blogs.service';
import { BlogError, CreateBlogInput, CreateBlogOutput } from '../blogs.types';
import blogsController from './blogs.controller';

class BlogsController {
  private blogsQueryRepository: BlogsQueryRepository;
  private blogsService: BlogsService;

  constructor() {
    this.blogsQueryRepository = new BlogsQueryRepository();
    this.blogsService = new BlogsService();
  }

  async getBlogs(req: Request, res: Response) {
    const sortingData = generateSortingDataObject(req);
    try {
      const blogs = await this.blogsQueryRepository.getBlogs(sortingData);
      res.status(200).json(blogs);
      return;
    } catch (error) {
      handleError(res, error);
    }
  }

  async createBlog(req: RequestWithBody<CreateBlogInput>, res: Response<CreateBlogOutput | BlogError>) {
    try {
      const createdBlog = await this.blogsService.createBlog({ ...req.body });
      res.status(201).json(createdBlog);
      return;
    } catch (error) {
      handleError(res, error);
    }
  }

  async getBlogById(
    req: RequestWithRouteParams<RoutePathWithIdParam>,
    res: Response<BlogType | BlogType[] | BlogError>,
  ) {
    const { id: searchableBlogId } = req.params;
    if (!searchableBlogId) {
      return await blogsController.getBlogs(req, res);
    }

    try {
      const blog = await this.blogsQueryRepository.getBlogById(searchableBlogId);
      res.status(200).json(blog);
      return;
    } catch (error) {
      handleError(res, error);
    }
  }

  async updateBlog(req: RequestWithRouteParamsAndBody<RoutePathWithIdParam, CreateBlogInput>, res: Response) {
    try {
      const updatedBlog = await this.blogsService.updateBlog({ ...req.body }, new ObjectId(req.params.id));
      res.sendStatus(204);
      return;
    } catch (error) {
      handleError(res, error);
    }
  }

  async deleteBlog(req: RequestWithRouteParams<RoutePathWithIdParam>, res: Response) {
    try {
      const blog = await this.blogsService.deleteBlog(new ObjectId(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      handleError(res, error);
    }
  }
}

export default new BlogsController();
