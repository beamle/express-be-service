import { Request, Response } from "express";
import { BlogType, db } from "../../app/db";
import { RequestWithBody, RequestWithRouteParamsAndBody, RoutePathWithIdParam } from "../RequestTypes";
import { BlogError, CreateBlogInput, CreateBlogOutput } from "./blogs.types";
import { BlogDto } from "./blogs.dto";
import blogsController from "./blogs.controller";

const urlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

function validateBlogInput(data: { name: string, description: string, websiteUrl: string }, id?: string) {
  const errors = {
    errorsMessages: []
  }

  const { name, description, websiteUrl } = data
  if (name.length > 15) {
    errors.errorsMessages.push({ message: "Name should less or equal to 15 symbols", field: "name" })
  }
  if (name.length < 1) {
    errors.errorsMessages.push({ message: "Name should be at least 1 symbol long", field: "name" })
  }
  if (description.length > 500) {
    errors.errorsMessages.push({ message: "Description should be maximum 500 symbols long", field: "description" })
  }
  if (description.length < 1) {
    errors.errorsMessages.push({ message: "Description should be at least 1 symbol long", field: "description" })
  }
  if (websiteUrl.length > 100 || !urlRegex.test(description)) {
    errors.errorsMessages.push({
      message: "Invalid URL. Url should be maximum 100 symbols long and correspond to " +
        `${urlRegex} pattern `, field: "description"
    })
  }
  if (websiteUrl.length < 1) {
    errors.errorsMessages.push({ message: "Invalid URL. Url should be at least 1 symbol long", field: "description" })
  }

  if (id !== undefined && String(id).trim().length < 1) {
    errors.errorsMessages.push({ message: "No id provided", field: "id" })
  }
  return errors
}

function createBlogValidation(req: Request) {
  return validateBlogInput({ ...req.body })
}

function updateBlogValidation(req: Request) {
  const { id } = req.params
  return validateBlogInput({ ...req.body }, id)
}

function validateDeleteBlog(id: string) {
  const errors = { errorsMessages: [] };

  if (!id || String(id).trim().length < 1) {
    errors.errorsMessages.push({ message: "No id provided", field: "id" });
  }

  return errors;
}

class BlogsController {
  async getBlogs(req: Request, res: Response) {
    res.status(200).json(db.blogs)
  }

  async createBlog(req: RequestWithBody<CreateBlogInput>, res: Response<CreateBlogOutput | BlogError>) {
    const errors = createBlogValidation(req)
    if (errors.errorsMessages.length > 0) {
      res.status(400).json(errors.errorsMessages[0])
      return
    }

    const newBlog = {
      id: String(db.blogs.length + 1),
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl
    }

    db.blogs = [...db.blogs, newBlog]
    res.status(201).json(newBlog)
  }

  async getBlogById(req: Request<RoutePathWithIdParam>, res: Response<BlogType | BlogType[] | BlogError>) {
    const { id: searchableBlogId } = req.params.id
    if (searchableBlogId === undefined) {
      const allBlogs = await blogsController.getBlogs(req, res)
      return allBlogs
    }

    const blog = db.blogs.find(blog => blog.id === searchableBlogId)
    if (blog) {
      res.status(200).json(blog)
    } else {
      res.status(404).json({ message: 'Blog with such id was not found', field: 'id' })
    }
  }

  async updateBlog(req: RequestWithRouteParamsAndBody<RoutePathWithIdParam, CreateBlogInput>, res: Response) {
    const errors = updateBlogValidation(req)
    if (errors.errorsMessages.length > 0) {
      res.status(400).json(errors.errorsMessages[0])
      return
    }

    const blog = db.blogs.find(blog => blog.id === req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found", field: "id" });
    }

    const blogDto = new BlogDto(...req.body)

    Object.assign(blog, blogDto)

    res.status(204)
  }

  async deleteBlog(req: Request<RoutePathWithIdParam>, res: Response) {
    const errors = validateDeleteBlog(String(req.params.id))
    if(errors.errorsMessages.length > 0) {
      res.status(400).json(errors.errorsMessages[0])
      return
    }

    const blog = db.blogs.find(blog => blog.id === req.params.id)
    if (!blog) {
      return res.status(404).json({ message: "Blog not found", field: "id" });
    }

    db.blogs.filter(blog => blog.id !== req.params.id)

    res.status(204)
  }
}

export default new BlogsController();