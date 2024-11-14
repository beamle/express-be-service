import { blogsCollection, BlogsSortingData, BlogType, postsCollection, PostsSortingData } from "../../app/db";
import { CreateBlogInput } from "./blogs.types";
import { ObjectId } from "mongodb";

export const blogsRepository = {
  async getBlogs({ pageNumber, pageSize, sortBy, sortDirection, searchNameTerm }: BlogsSortingData, filter: any) {
    const blogs = await blogsCollection
      .find(filter ? filter : {}, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray()

    return blogs
  },

  async create(input: CreateBlogInput): Promise<ObjectId> {
    const { name, description, websiteUrl } = input
    let newBlog: BlogType = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }

    const result = await blogsCollection.insertOne(newBlog)
    const updateId =  await blogsCollection.updateOne({ _id: result.insertedId },{
      $set: {
        id: result.insertedId.toString()
      }
    })

    return result.insertedId
  },

  async findBy(searchableBlogId: ObjectId): Promise<BlogType | null> {
    return await blogsCollection.findOne({ _id: searchableBlogId }, {projection: {_id: 0}})
  },

  async updateBlog(dataForUpdate: CreateBlogInput, searchableBlogId: ObjectId): Promise<boolean | number> {
    const { name, description, websiteUrl } = dataForUpdate
    // TODO: chtoby proshe bylo debazhitj to vse perenesti v Service
    const blog = await this.findBy(searchableBlogId)

    if (!blog) {
      return false
    }

    const resultOfUpdatingBlog = await blogsCollection.updateOne({ _id: searchableBlogId },{
      $set: {
        name,
        description,
        websiteUrl
      }
    })

    return resultOfUpdatingBlog.matchedCount;
  },

  async delete(blogId: ObjectId): Promise<boolean> {
    const blog = await blogsCollection.findOne({ _id: blogId })
    if (!blog) {
      return false
    }

    const deleteBlogResult = await blogsCollection.deleteOne({ _id: blogId })
    if (deleteBlogResult.deletedCount === 0) {
      return false
    }

    const deletePostsResult = await postsCollection.deleteMany({ blogId: blogId.toString() })
    return deletePostsResult.acknowledged
  }
}