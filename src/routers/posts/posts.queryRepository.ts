import { ObjectId } from "mongodb";
import { PostErrors } from "./posts.service";
import { commentsCollection, postsCollection, PostsSortingData, PostType } from "../../app/db";
import { postsRepository } from "./posts.repository";
import { CustomError } from "../../helpers/CustomError";

class PostsQueryRepository {

  async getPosts(sortingData: PostsSortingData, blogId?: ObjectId) {
    const posts = blogId
      ? await postsRepository.getPosts(sortingData, blogId)
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

  async getPostCommentsByPostId(sortingData: PostsSortingData, searchablePostId: ObjectId): Promise<any> {
    // const post = await postsRepository.findBy(searchablePostId)

    const posts = await postsRepository.getPosts(sortingData)

    if (!posts) {
      throw new CustomError({ message: "no error description", field: "", status: 400 })
    }

    const postsLength = await commentsCollection.countDocuments(searchablePostId ? { postId: searchablePostId.toString() } : {})

    return {
      pagesCount: Math.ceil(postsLength / sortingData.pageSize),
      page: sortingData.pageNumber,
      pageSize: sortingData.pageSize,
      totalCount: postsLength,
      items: posts
    }

  }
}

export default new PostsQueryRepository()