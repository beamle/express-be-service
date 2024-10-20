import { db } from "../../app/db";
import { CreatePostInput } from "./posts.types";
import { PostsDto } from "./posts.dto";

export const postsRepository = {
  async getPosts() {
    return db.posts
  },

  async create(input: CreatePostInput) {
    const newPost = {
      id: String(db.posts.length + 1),
      ...input
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

    const { title, shortDescription, content, blogName } = dataForUpdate

    const post = db.posts.find(post => post.id === searchablePostId)

    const postDto = new PostsDto(title, shortDescription, content, blogName)

    Object.assign(post, postDto)

    return true
  },

  async delete(postId: string) {
    // const post = db.posts.find(post => post.id === postId)

    db.posts = db.posts.filter(post => post.id !== postId)

    return true

  }
}