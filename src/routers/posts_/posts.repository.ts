import { db } from "../../app/db";
import { CreatePostInput } from "./posts.types";
import { PostsDto } from "./posts.dto";

export const postsRepository = {
  async getPosts() {
    return db.posts
  },

  async create(input: CreatePostInput) {
    const findBlog = db.blogs.find(blog => input.blogId)

    if (!findBlog) {
      throw new Error("No blog with such id!")
    }

    const newPost = {
      id: String(db.posts.length + 1),
      ...input,
      blogName: findBlog.name
    }

    db.posts = [...db.posts, newPost]

    return { createdPost: newPost }
  },

  async findBy(searchablePostId: string) {
    return db.posts.find(post => post.id === searchablePostId)
  },

  async updatePost(dataForUpdate: {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  }, searchablePostId: string) {

    // const { title, shortDescription, content, blogName } = dataForUpdate

    const post = db.posts.find(post => post.id === searchablePostId)

    if (!post) {
      return false
    }

    // const postDto = new PostsDto(title, shortDescription, content, blogName)

    Object.assign(post, dataForUpdate)

    return true
  },

  async delete(postId: string) {
    const post = db.posts.find(post => post.id === postId)
    if (!post) {
      return false
    }
    db.posts = db.posts.filter(post => post.id !== postId)

    return true

  }
}