import { inject, injectable } from 'inversify'; import 'reflect-metadata';
import { Types } from 'mongoose';
import { PostsSortingData, PostType } from '../../app/db';
import { CustomError } from '../../helpers/CustomError';
import { CommentsQueryRepository } from '../comments/comments.queryRepository';
import { PostsRepository } from './posts.repository';
import { PostErrors } from './posts.service';
import { PostModel } from './posts.schema';
import { CommentModel } from '../comments/comments.schema';

@injectable()
export class PostsQueryRepository {
  constructor(
    @inject(PostsRepository) private postsRepository: PostsRepository,
    @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
  ) {
    this.postsRepository = postsRepository;
    this.commentsQueryRepository = commentsQueryRepository;
  }
  async getPosts(sortingData: PostsSortingData, blogId?: Types.ObjectId) {
    const posts = blogId
      ? await this.postsRepository.getPosts(sortingData, blogId)
      : await this.postsRepository.getPosts(sortingData);

    if (!posts) {
      throw new CustomError({ message: 'no error description', field: '', status: 400 });
    }

    const postsLength = await PostModel.countDocuments(blogId ? { blogId: blogId.toString() } : {});

    return {
      pagesCount: Math.ceil(postsLength / sortingData.pageSize),
      page: sortingData.pageNumber,
      pageSize: sortingData.pageSize,
      totalCount: postsLength,
      items: posts,
    };
  }

  async getPostById(searchablePostId: Types.ObjectId): Promise<PostType> {
    const post = await this.postsRepository.findBy(searchablePostId);
    if (!post) {
      throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID);
    }

    return post;
  }

  async getPostCommentsByPostId(sortingData: PostsSortingData, searchablePostId: Types.ObjectId, userId?: string): Promise<any> {
    const posts = await this.commentsQueryRepository.getCommentsByPostId(sortingData, searchablePostId.toString(), userId);

    if (!posts) {
      throw new CustomError({ message: 'no error description', field: '', status: 400 });
    }

    const postsLength = await CommentModel.countDocuments(
      searchablePostId ? { postId: searchablePostId.toString() } : {},
    );

    return {
      pagesCount: Math.ceil(postsLength / sortingData.pageSize),
      page: sortingData.pageNumber,
      pageSize: sortingData.pageSize,
      totalCount: postsLength,
      items: posts,
    };
  }
}
