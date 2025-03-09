import { ObjectId } from "mongodb";
import { BlogErrors } from "./blogs.service";
import { blogsCollection, BlogsModelView, BlogsSortingData, BlogType } from "../../app/db";
import { blogsRepository } from "../blogs/blogs.repository";
import { PostErrors } from "../posts/posts.service";
import { createFilter } from "../../helpers/objectGenerators";
import { CustomError } from "../../helpers/CustomError";

class BlogsQueryRepository {
  async getBlogs(sortingData: BlogsSortingData, blogId?: string): Promise<BlogsModelView> {
    const filter: any = createFilter(sortingData)
    const blogsLength = await blogsCollection.countDocuments(filter) // make aggregation?
    const blogs = await blogsRepository.getBlogs(sortingData, filter)

    if (!blogs) {
      throw new CustomError(BlogErrors.NO_BLOGS)
    }

    return {
      pagesCount: Math.ceil(blogsLength / sortingData.pageSize),
      page: sortingData.pageNumber,
      pageSize: sortingData.pageSize,
      totalCount: blogsLength,
      items: blogs
    }
  }

  async getBlogById(searchablePostId: string): Promise<BlogType> {
    const post = await blogsRepository.findBy(new ObjectId(searchablePostId))

    if (!post) {
      throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID)
    }

    return post
  }
}

export default new BlogsQueryRepository()