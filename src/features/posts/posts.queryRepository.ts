import { inject, injectable } from 'inversify'; import 'reflect-metadata';
import { Types } from 'mongoose';
import { PostsSortingData, PostType } from '../../app/db';
import { CustomError } from '../../helpers/CustomError';
import { CommentsQueryRepository } from '../comments/comments.queryRepository';
import { PostsRepository } from './posts.repository';
import { PostErrors } from './posts.service';
import { PostModel, PostLikeModel } from './posts.schema';
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
  async getPosts(sortingData: PostsSortingData, blogId?: Types.ObjectId, userId?: string) {
    const posts = blogId
      ? await this.postsRepository.getPosts(sortingData, blogId)
      : await this.postsRepository.getPosts(sortingData);

    if (!posts) {
      throw new CustomError({ message: 'no error description', field: '', status: 400 });
    }

    const postsLength = await PostModel.countDocuments(blogId ? { blogId: blogId.toString() } : {});

    const mappedPosts = await Promise.all(posts.map(p => this.mapToPostType(p, userId)));

    return {
      pagesCount: Math.ceil(postsLength / sortingData.pageSize),
      page: sortingData.pageNumber,
      pageSize: sortingData.pageSize,
      totalCount: postsLength,
      items: mappedPosts,
    };
  }

  async getPostById(searchablePostId: Types.ObjectId, userId?: string): Promise<PostType> {
    const post = await this.postsRepository.findBy(searchablePostId);
    if (!post) {
      throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID);
    }

    return await this.mapToPostType(post, userId);
  }

  private async mapToPostType(post: any, userId?: string): Promise<PostType> {
    const { _id, ...rest } = post;
    const postIdStr = _id ? _id.toString() : post.id;

    // In case it's already mapped
    if (rest.extendedLikesInfo) {
      return { ...rest, id: postIdStr } as PostType;
    }

    const likesCount = await PostLikeModel.countDocuments({ postId: postIdStr, status: 'Like' });
    const dislikesCount = await PostLikeModel.countDocuments({ postId: postIdStr, status: 'Dislike' });

    let myStatus: 'None' | 'Like' | 'Dislike' = 'None';
    if (userId) {
      const userLike = await PostLikeModel.findOne({ postId: postIdStr, userId }).lean();
      if (userLike) {
        myStatus = userLike.status as 'None' | 'Like' | 'Dislike';
      }
    }

    const newestLikesDocs = await PostLikeModel.find({ postId: postIdStr, status: 'Like' })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();

    const newestLikes = newestLikesDocs.map(like => ({
      addedAt: like.addedAt.toISOString(),
      userId: like.userId,
      login: like.login
    }));

    return {
      ...rest,
      id: postIdStr,
      extendedLikesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
        newestLikes
      }
    } as PostType;
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
