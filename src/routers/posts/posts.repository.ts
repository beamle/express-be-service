import { ObjectId } from 'mongodb'; import 'reflect-metadata';
import { CommentsSortingData, PostsSortingData, PostType } from '../../app/db';
import { BlogsRepository } from '../blogs/blogs.repository';
import { CommentatorInfo, CreatePostInput } from './posts.types';
import { inject, injectable } from 'inversify';
import { PostModel } from './posts.schema';
import { CommentModel } from '../comments/comments.schema';

@injectable()
export class PostsRepository {
  constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {
    this.blogsRepository = blogsRepository;
  }
  async getPosts(sortingData: PostsSortingData, blogId?: ObjectId) {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortingData;

    const posts = await PostModel
      .find(blogId ? { blogId: blogId.toString() } : {})
      .select('-_id -__v')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .lean();

    console.log(posts);
    return posts;
  }

  async getPostsByBlogId(blogId: ObjectId, sortingData: PostsSortingData) {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortingData;

    return await PostModel
      .find({ blogId: blogId.toString() })
      .select('-_id -__v')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .lean();
  }

  async create(input: CreatePostInput, blogIdAsParam?: ObjectId): Promise<ObjectId | boolean> {
    let blog;
    if (blogIdAsParam) {
      blog = await this.blogsRepository.findBy(blogIdAsParam);
    } else {
      blog = await this.blogsRepository.findBy(new ObjectId(input.blogId));
    }
    if (!blog) {
      return false;
    }

    const newPost = new PostModel({
      id: String(Math.floor(Math.random() * 223)),
      ...input,
      blogName: blog.name,
      blogId: input.blogId || String(blogIdAsParam),
      createdAt: new Date().toISOString(),
    });

    const resultOfCreatingNewPost = await newPost.save();

    resultOfCreatingNewPost.id = resultOfCreatingNewPost._id.toString();
    await resultOfCreatingNewPost.save();

    return new ObjectId(resultOfCreatingNewPost.id);
  }

  async findBy(searchablePostId: ObjectId): Promise<PostType | null> {
    const post = await PostModel.findOne({ _id: searchablePostId }).select('-_id -__v').lean();
    if (!post) {
      return null;
    }

    return post;
  }

  async updatePost(
    dataForUpdate: {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
      blogName: string;
    },
    searchablePostId: ObjectId,
  ) {
    const post = await this.findBy(searchablePostId);

    if (!post) {
      return false;
    }

    const resultOfUpdatingPost = await PostModel.updateOne(
      { _id: searchablePostId },
      { $set: { ...dataForUpdate } },
    );

    return resultOfUpdatingPost.modifiedCount > 0;
  }

  async delete(postId: ObjectId): Promise<boolean> {
    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      return false;
    }
    const resultOfDeletingPost = await PostModel.deleteOne({ _id: postId });

    return resultOfDeletingPost.deletedCount > 0;
  }

  async createComment(postId: ObjectId, commentatorInfo: CommentatorInfo, content: string): Promise<ObjectId> {
    const newComment = new CommentModel({
      postId: postId.toString(),
      content: content,
      commentatorInfo: commentatorInfo,
      createdAt: new Date().toISOString(),
    });

    const createdComment = await newComment.save();

    // As per the schema, we assign _id.toString() to id
    createdComment.id = createdComment._id.toString();
    await createdComment.save();

    return new ObjectId(createdComment.id);
  }

  async getCommentsBy(postId: ObjectId, sortingData: CommentsSortingData = sortingBase): Promise<any> {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortingData;

    return await CommentModel
      .find({ postId: postId.toString() })
      .select('-_id -__v')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .lean();
  }
}

const sortingBase: CommentsSortingData = { pageNumber: 1, pageSize: 10, sortBy: 'createdAt', sortDirection: 'desc' };
