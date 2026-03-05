import { inject, injectable } from 'inversify';import 'reflect-metadata';
import { Types } from 'mongoose';
import { PostsSortingData, PostType } from '../../app/db';
import { CustomError } from '../../helpers/CustomError';
import { PostsRepository } from './posts.repository';
import { CommentatorInfo, CreatePostInput } from './posts.types';

export const PostErrors = {
  NO_POSTS: { message: 'Something went wrong, try again.', field: '', status: 404 },
  NO_BLOG_WITH_SUCH_ID: { message: 'No blog with such id has been found!', field: 'blogId', status: 404 },
  POST_NOT_CREATED: { message: 'Post was not created!', field: '', status: 404 },
  NO_POST_WITH_SUCH_ID: { message: 'Post with such id was not found!', field: 'id', status: 404 },
  INTERNAL_SERVER_ERROR: { message: 'Internal server error', field: '', status: 500 },
  DID_NOT_CREATE_COMMENT: { message: "Didn't create comment", field: '', status: 400 },
};

@injectable()
export class PostsService {
  constructor(@inject(PostsRepository) private postsRepository: PostsRepository) {
    this.postsRepository = postsRepository;
  }
  async createPost(postCreatingInput: CreatePostInput): Promise<PostType> {
    const createdPostId = await this.postsRepository.create(postCreatingInput);

    if (!(createdPostId instanceof Types.ObjectId)) {
      throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID);
    }

    const createdPost = await this.postsRepository.findBy(new Types.ObjectId(createdPostId));

    if (!createdPost) {
      throw new CustomError(PostErrors.POST_NOT_CREATED);
    }

    return createdPost;
  }

  async createPostForBlog(postCreatingInput: CreatePostInput, blogIdAsParam: string): Promise<PostType> {
    const createdPostId = await this.postsRepository.create(
      postCreatingInput,
      blogIdAsParam ? new Types.ObjectId(blogIdAsParam) : undefined,
    );
    if (!(createdPostId instanceof Types.ObjectId)) {
      throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID);
    }

    const createdPost = await this.postsRepository.findBy(new Types.ObjectId(createdPostId));

    if (!createdPost) {
      throw new CustomError(PostErrors.POST_NOT_CREATED);
    }

    return createdPost;
  }

  async updatePost(
    dataForUpdate: {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
      blogName: string;
    },
    postId: Types.ObjectId,
  ): Promise<boolean | number> {
    const updatedPost = await this.postsRepository.updatePost(dataForUpdate, postId);

    if (!updatedPost) {
      throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID);
    }

    return updatedPost;
  }

  async deletePost(postId: Types.ObjectId): Promise<boolean> {
    const post = await this.postsRepository.delete(postId);

    if (!post) {
      throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID);
    }

    return post;
  }

  async createCommentForPost(postId: Types.ObjectId, commentatorInfo: CommentatorInfo, content: string): Promise<Types.ObjectId> {
    const createdCommentId = await this.postsRepository.createComment(postId, commentatorInfo, content);

    if (!createdCommentId) {
      throw new CustomError(PostErrors.DID_NOT_CREATE_COMMENT);
    }

    return createdCommentId;
  }
  // TODO PROMISE ANY
  async getCommentForPostBy(sortingData: PostsSortingData, postId: Types.ObjectId): Promise<any> {
    const createdCommentId = await this.postsRepository.getCommentsBy(postId, sortingData);

    if (!createdCommentId) {
      throw new CustomError(PostErrors.DID_NOT_CREATE_COMMENT);
    }

    return createdCommentId;
  }
}
