import { Request, Response } from "express";
import { ObjectId, SortDirection } from "mongodb";
import postsService, { CustomError, PostErrors } from "./posts.service";
import { postsCollection, PostsSortingData, PostType } from "../../app/db";
import { blogsRepository } from "../blogs/blogs.repository";
import { postsRepository } from "./posts.repository";

class PostsQueryRepository {

  async getPosts(sortingData: PostsSortingData, blogId?: string) {
    // if (blogId) {
    //   const blog = await blogsRepository.findBy(new ObjectId(blogId))
    //
    //   if (!blog) {
    //     throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID)
    //   }
    // }

    const posts = blogId
      ? await postsRepository.getPosts(sortingData, new ObjectId(blogId))
      : await postsRepository.getPosts(sortingData)

    if (!posts) {
      throw new CustomError({ message: "no error description", field: "", status: 400 })
    }

    const postsLength = await postsCollection.countDocuments(blogId ? { blogId: blogId.toString() } : {})

    return {
      pagesCount: Math.ceil(postsLength / sortingData.pageSize),
      page: sortingData.pageNumber,
      pageSize: sortingData.pageSize,
      totalCount: postsLength,
      items: posts
    }
  }

  async getPostById(searchablePostId: ObjectId): Promise<PostType> {

    const post = await postsRepository.findBy(searchablePostId)
    if (!post) {
      throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID)
    }

    return post

  }
}

export default new PostsQueryRepository()