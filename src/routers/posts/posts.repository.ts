import { ObjectId } from 'mongodb';
import { commentsCollection, CommentsSortingData, postsCollection, PostsSortingData, PostType } from '../../app/db';
import { BlogsRepository } from '../blogs/blogs.repository';
import { CommentatorInfo, CreatePostInput } from './posts.types';

export class PostsRepository {
  private blogsRepository: BlogsRepository;

  constructor() {
    this.blogsRepository = new BlogsRepository();
  }
  async getPosts(sortingData: PostsSortingData, blogId?: ObjectId) {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortingData;

    const posts = await postsCollection
      .find(blogId ? { blogId: blogId.toString() } : {}, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray();

    console.log(posts);
    return posts;
  }

  async getPostsByBlogId(blogId: ObjectId, sortingData: PostsSortingData) {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortingData;

    return await postsCollection
      .find({ blogId: blogId.toString() }, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray();
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

    const newPost: PostType = {
      id: String(Math.floor(Math.random() * 223)),
      ...input,
      blogName: blog.name,
      blogId: input.blogId || String(blogIdAsParam),
      createdAt: new Date().toISOString(),
    };

    const resultOfCreatingNewPost = await postsCollection.insertOne(newPost);

    const updatePostId = await postsCollection.updateOne(
      { _id: resultOfCreatingNewPost.insertedId },
      {
        $set: {
          id: resultOfCreatingNewPost.insertedId.toString(),
        },
      },
    );

    return resultOfCreatingNewPost.insertedId;
  }

  async findBy(searchablePostId: ObjectId): Promise<PostType | null> {
    const post = await postsCollection.findOne({ _id: searchablePostId }, { projection: { _id: 0 } });
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

    const resultOfUpdatingPost = await postsCollection.updateOne(
      { _id: searchablePostId },
      { $set: { ...dataForUpdate } },
    );

    return resultOfUpdatingPost.acknowledged;
  }

  async delete(postId: ObjectId): Promise<boolean> {
    const post = await postsCollection.findOne({ _id: postId });

    if (!post) {
      return false;
    }
    const resultOfDeletingPost = await postsCollection.deleteOne({ _id: postId });

    return resultOfDeletingPost.acknowledged;
  }

  async createComment(postId: ObjectId, commentatorInfo: CommentatorInfo, content: string): Promise<ObjectId> {
    const newComment = {
      postId: postId.toString(),
      content: content,
      commentatorInfo: commentatorInfo,
      createdAt: new Date().toISOString(),
    };

    const createdComment = await commentsCollection.insertOne(newComment);

    return createdComment.insertedId;
  }

  async getCommentsBy(postId: ObjectId, sortingData: CommentsSortingData = sortingBase): Promise<any> {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortingData;

    return await commentsCollection
      .find({ postId: postId.toString() }, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray();
  }
}

const sortingBase: CommentsSortingData = { pageNumber: 1, pageSize: 10, sortBy: 'createdAt', sortDirection: 'desc' };
