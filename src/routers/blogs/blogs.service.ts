import { ObjectId } from "mongodb";
import { blogsCollection, BlogsSortingData, BlogType } from "../../app/db";
import { blogsRepository } from "./blogs.repository";
import { CreateBlogInput } from "./blogs.types";

export const BlogErrors = {
  NO_BLOGS: { message: "Something went wrong, try again.", field: "", status: 404 },
  NO_BLOG_WITH_SUCH_ID: { message: "No blog with such id has been found!", field: "id", status: 404 },
  BLOG_NOT_CREATED: { message: "Blog was not created!", field: "", status: 400 },
  INTERNAL_SERVER_ERROR: { message: "Internal server error", field: "", status: 500 }
}

export class CustomError extends Error {
  status: number;
  field: string;

  constructor({ message, field, status }: { message: string, status: number, field: string }) {
    super(message);
    this.status = status;
    this.field = field;
  }
}


class BlogsService {
  async getBlogs(sortingData: BlogsSortingData): Promise<{ blogs: BlogType[], totalCount: number }> {
    const blogs = await blogsRepository.getBlogs(sortingData)
    const filter: any = {}
    if (sortingData.searchNameTerm) {
      filter.name = { $regex: sortingData.searchNameTerm, $options: 'i' } // ignore Cc
    }
    const blogsLength = await blogsCollection.countDocuments(filter)
    if (!blogs) {
      throw new CustomError(BlogErrors.NO_BLOGS)
    }
    return { blogs, totalCount: blogsLength }
  }

  async createBlog(blogCreatingInput: CreateBlogInput): Promise<BlogType> {
    const createdBlogId = await blogsRepository.create(blogCreatingInput) // TODO: vsju logiku po sozdaniju vynesti sjuda

    if (!(createdBlogId instanceof ObjectId)) {
      throw new CustomError(BlogErrors.NO_BLOG_WITH_SUCH_ID)
    }

    const createdBlog = await blogsRepository.findBy(createdBlogId)

    if (!createdBlog) {
      throw new CustomError(BlogErrors.BLOG_NOT_CREATED)
    }

    return createdBlog
  }

  async getBlogById(searchableBlogId: ObjectId): Promise<BlogType> {
    const blog = await blogsRepository.findBy(searchableBlogId)
    if (!blog) {
      throw new CustomError(BlogErrors.NO_BLOG_WITH_SUCH_ID)
    }
    return blog;
  }


  async updateBlog(dataForUpdate: CreateBlogInput, blogId: ObjectId): Promise<boolean | number> {
    const updatedBlog = await blogsRepository.updateBlog(dataForUpdate, blogId)

    if (!updatedBlog) {
      throw new CustomError(BlogErrors.NO_BLOG_WITH_SUCH_ID)
    }

    return updatedBlog
  }

  async deleteBlog(blogId: ObjectId): Promise<boolean> {
    const blog = await blogsRepository.delete(blogId)
debugger
    if (!blog) {
      throw new CustomError(BlogErrors.NO_BLOG_WITH_SUCH_ID)
    }

    return blog
  }
}

export default new BlogsService();