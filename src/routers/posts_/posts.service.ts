import { postsRepository } from "../posts_/posts.repository";
import { CreatePostInput } from "./posts.types";
import { ObjectId } from "mongodb";
import { PostsSortingData, PostType } from "../../app/db";
import { blogsRepository } from "../blogs/blogs.repository";

export const PostErrors = {
  NO_POSTS: { message: "Something went wrong, try again.", field: "", status: 404 },
  NO_BLOG_WITH_SUCH_ID: { message: "No blog with such id has been found!", field: "blogId", status: 400 },
  POST_NOT_CREATED: { message: "Post was not created!", field: "", status: 404 },
  NO_POST_WITH_SUCH_ID: { message: "Post with such id was not found!", field: "id", status: 404 },
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


class PostsService {
  async getPosts(sortingData: PostsSortingData): Promise<PostType[]> {
    const posts = await postsRepository.getPosts(sortingData)
    if (!posts) {
      throw new CustomError(PostErrors.NO_POSTS)
    }
    return posts
  }

  async getPostsByBlogId(blogId: ObjectId, sortingData: PostsSortingData) {
    const blog = await blogsRepository.findBy(new ObjectId(blogId))
    if (!blog) {
      throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID)
    }
    const blogPosts = await postsRepository.getPostsByBlogId(blogId, sortingData)
    if (!blogPosts) {
      throw new CustomError({ message: "no error description", field: "", status: 404 })
    }
    return blogPosts
  }


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

  async getPostById(searchablePostId: ObjectId): Promise<PostType> {
    const post = await postsRepository.findBy(searchablePostId)
    if (!post) {
      throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID)
    }
    return post;
  }

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
}

export default new PostsService();