// dat access layer
// isolates how we work with database
import { db } from "../../app/db";
import { CreateBlogInput } from "./blogs.types";
import { BlogDto } from "./blogs.dto";

export const blogsRepository = {
  async getBlogs() {
    return db.blogs
  },

  async create(input: CreateBlogInput) {
    const { name, description, websiteUrl } = input
    const newBlog = {
      id: String(db.blogs.length + 1),
      name,
      description,
      websiteUrl
    }

    db.blogs = [...db.blogs, newBlog]

    return { createdBlog: newBlog }
  },

  async findBy(searchableBlogId: string) {
    return db.blogs.find(blog => blog.id === searchableBlogId)
  },

  async updateBlog(dataForUpdate: { name:string, description: string, websiteUrl: string} , searchableBlogId: string) {
    const { name, description, websiteUrl } = dataForUpdate
    const blog = db.blogs.find(blog => blog.id === searchableBlogId)
    if(!blog) {
      return false
    }
    const blogDto = new BlogDto(name, description, websiteUrl)
    Object.assign(blog, blogDto)

    return true
  },

  async delete(blogId: string) {
    const blog = db.blogs.find(blog => blog.id === blogId)
    if(!blog) {
      return false
    }
    db.blogs = db.blogs.filter(blog => blog.id !== blogId)
    db.posts = db.posts.filter(post => post.blogId !== blogId)

    return true
  }
}