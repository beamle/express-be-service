import { Router } from "express";
import blogsController from "./blogs.controller";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getBlogs)
blogsRouter.post("/", blogsController.createBlog)
blogsRouter.post("/:id", blogsController.getBlogById)