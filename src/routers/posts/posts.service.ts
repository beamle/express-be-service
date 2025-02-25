import { postsRepository } from ".//posts.repository";
import { CommentatorInfo, CreatePostInput } from "./posts.types";
import { ObjectId } from "mongodb";
import { PostsSortingData, PostType } from "../../app/db";
import { blogsRepository } from "../blogs/blogs.repository";
import { CustomError } from "../../helpers/CustomError";

export const PostErrors = {
  NO_POSTS: { message: "Something went wrong, try again.", field: "", status: 404 },
  NO_BLOG_WITH_SUCH_ID: { message: "No blog with such id has been found!", field: "blogId", status: 404 },
  POST_NOT_CREATED: { message: "Post was not created!", field: "", status: 404 },
  NO_POST_WITH_SUCH_ID: { message: "Post with such id was not found!", field: "id", status: 404 },
  INTERNAL_SERVER_ERROR: { message: "Internal server error", field: "", status: 500 },
  DID_NOT_CREATE_COMMENT: { message: "Didn't create comment", field: "", status: 400 }
}

class PostsService {
  // async getPosts(sortingData: PostsSortingData, blogId?: ObjectId): Promise<PostType[]> {
    // if(blogId) {
    //   const blog = await blogsRepository.findBy(blogId)
    //
    //   if (!blog) {
    //     throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID)
    //   }
    //   const blogPosts = await postsRepository.getPosts(sortingData, blogId)
    //   if (!blogPosts) {
    //     throw new CustomError({ message: "no error description", field: "", status: 400 })
    //   }
    //   return blogPosts
    // }

    // return await postsRepository.getPosts(sortingData)
  // }

  async createPost(postCreatingInput: CreatePostInput): Promise<PostType> {
    const createdPostId = await postsRepository.create(postCreatingInput)

    if (!(createdPostId instanceof ObjectId)) {
      throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID)
    }

    const createdPost = await postsRepository.findBy(new ObjectId(createdPostId))

    if (!createdPost) {
      throw new CustomError(PostErrors.POST_NOT_CREATED)
    }

    return createdPost
  }

  async createPostForBlog(postCreatingInput: CreatePostInput, blogIdAsParam: string): Promise<PostType> {
    const createdPostId = await postsRepository.create(postCreatingInput, blogIdAsParam ? new ObjectId(blogIdAsParam) : undefined)
    if (!(createdPostId instanceof ObjectId)) {
      throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID)
    }

    const createdPost = await postsRepository.findBy(new ObjectId(createdPostId))

    if (!createdPost) {
      throw new CustomError(PostErrors.POST_NOT_CREATED)
    }

    return createdPost
  }

  // async getPostById(searchablePostId: ObjectId): Promise<PostType> {
    // const post = await postsRepository.findBy(searchablePostId)
    // if (!post) {
    //   throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID)
    // }
    // return post;
  // }

  async updatePost(dataForUpdate: {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  }, postId: ObjectId): Promise<boolean | number> {
    const updatedPost = await postsRepository.updatePost(dataForUpdate, postId)

    if (!updatedPost) {
      throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID)
    }

    return updatedPost
  }

  async deletePost(postId: ObjectId): Promise<boolean> {
    const post = await postsRepository.delete(postId)

    if (!post) {
      throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID)
    }

    return post
  }

  async createCommentForPost(postId: ObjectId, commentatorInfo: CommentatorInfo, content: string): Promise<ObjectId> {
    const createdCommentId = await postsRepository.createComment(postId, commentatorInfo, content)

    if(!createdCommentId) {
      throw new CustomError(PostErrors.DID_NOT_CREATE_COMMENT)
    }

    return createdCommentId
  }
// TODO PROMISE ANY
  async getCommentForPostBy(sortingData: PostsSortingData, postId: ObjectId): Promise<any> {
    const createdCommentId = await postsRepository.getCommentsBy(postId, sortingData)

    if(!createdCommentId) {
      throw new CustomError(PostErrors.DID_NOT_CREATE_COMMENT)
    }

    return createdCommentId
  }
}

export default new PostsService();