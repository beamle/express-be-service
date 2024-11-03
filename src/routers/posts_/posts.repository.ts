import { postsCollection, PostsSortingData, PostType } from "../../app/db";
import { CreatePostInput } from "./posts.types";
import { blogsRepository } from "../blogs/blogs.repository";
import { ObjectId } from "mongodb";

export const postsRepository = {
  async getPosts(sortingData: PostsSortingData) {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortingData

    const posts = await postsCollection
      .find({}, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray()

    return posts
  },

  async getPostsByBlogId(blogId, sortingData: PostsSortingData) {

    const { pageNumber, pageSize, sortBy, sortDirection } = sortingData

    return await postsCollection
      .find({ blogId: blogId.toString() }, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray()
  },

  async create(input: CreatePostInput, blogIdAsParam?: ObjectId): Promise<ObjectId | boolean> {
    let blog;
    if (blogIdAsParam) {
      blog = await blogsRepository.findBy(blogIdAsParam)
    } else {
      blog = await blogsRepository.findBy(new ObjectId(input.blogId))
    }
    if (!blog) {
      return false
    }

    const newPost: PostType = {
      id: String(Math.floor(Math.random() * 223)),
      ...input,
      blogName: blog.name,
      blogId: input.blogId || blogIdAsParam.toString(),
      createdAt: new Date().toISOString()
    }

    const resultOfCreatingNewPost = await postsCollection.insertOne(newPost)

    const updatePostId = await postsCollection.updateOne({ _id: resultOfCreatingNewPost.insertedId }, {
      $set: {
        id: resultOfCreatingNewPost.insertedId.toString()
      }
    })

    return resultOfCreatingNewPost.insertedId
  },

  async findBy(searchablePostId: ObjectId): Promise<PostType | null> {
    const post = await postsCollection.findOne({ _id: searchablePostId }, { projection: { _id: 0 } })
    if (!post) {
      return null
    }

    return post
  },

  async updatePost(dataForUpdate: {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  }, searchablePostId: ObjectId) {
    const post = await this.findBy(searchablePostId)

    if (!post) {
      return false
    }

    const resultOfUpdatingPost = await postsCollection.updateOne({ _id: searchablePostId }, { $set: { ...dataForUpdate } })

    return resultOfUpdatingPost.acknowledged
  },

  async delete(postId: ObjectId) {
    const post = await postsCollection.findOne({ _id: postId })

    if (!post) {
      return false
    }
    const resultOfDeletingPost = await postsCollection.deleteOne({ _id: postId })

    return resultOfDeletingPost.acknowledged
  }
}