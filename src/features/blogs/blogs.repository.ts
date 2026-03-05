import { Types } from 'mongoose';
import 'reflect-metadata';
import { BlogsSortingData, BlogType } from '../../app/db';
import { CreateBlogInput } from './blogs.types';
import { injectable } from 'inversify';
import { BlogModel } from './blogs.schema';
import { PostModel } from '../posts/posts.schema';

@injectable()
export class BlogsRepository {
  async getBlogs({ pageNumber, pageSize, sortBy, sortDirection, searchNameTerm }: BlogsSortingData, filter: any) {
    const blogs = await BlogModel
      .find(filter ? filter : {})
      .select('-_id -__v') // exclude _id and __v
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .lean();

    return blogs;
  }

  async create(input: CreateBlogInput): Promise<Types.ObjectId> {
    const { name, description, websiteUrl } = input;

    const newBlog = new BlogModel({
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });

    const result = await newBlog.save();

    result.id = result._id.toString();
    await result.save();

    return new Types.ObjectId(result.id);
  }

  async findBy(searchableBlogId: Types.ObjectId): Promise<BlogType | null> {
    return await BlogModel.findOne({ _id: searchableBlogId }).select('-_id -__v').lean();
  }

  async updateBlog(dataForUpdate: CreateBlogInput, searchableBlogId: Types.ObjectId): Promise<boolean | number> {
    const { name, description, websiteUrl } = dataForUpdate;
    // TODO: chtoby proshe bylo debazhitj to vse perenesti v Service
    const blog = await this.findBy(searchableBlogId);

    if (!blog) {
      return false;
    }

    const resultOfUpdatingBlog = await BlogModel.updateOne(
      { _id: searchableBlogId },
      {
        $set: {
          name,
          description,
          websiteUrl,
        },
      },
    );

    return resultOfUpdatingBlog.matchedCount;
  }

  async delete(blogId: Types.ObjectId): Promise<boolean> {
    const blog = await BlogModel.findOne({ _id: blogId });
    if (!blog) {
      return false;
    }

    const deleteBlogResult = await BlogModel.deleteOne({ _id: blogId });
    if (deleteBlogResult.deletedCount === 0) {
      return false;
    }

    const deletePostsResult = await PostModel.deleteMany({ blogId: blogId.toString() });
    return deletePostsResult.acknowledged;
  }
}
