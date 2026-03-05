import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Types } from 'mongoose';
import { BlogsModelView, BlogsSortingData, BlogType } from '../../app/db';
import { CustomError } from '../../helpers/CustomError';
import { createFilter } from '../../helpers/objectGenerators';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostErrors } from '../posts/posts.service';
import { BlogErrors } from './blogs.service';
import { BlogModel } from './blogs.schema';

@injectable()
export class BlogsQueryRepository {
  @inject(BlogsRepository) private blogsRepository: BlogsRepository;

  constructor() {
    this.blogsRepository = new BlogsRepository();
  }
  async getBlogs(sortingData: BlogsSortingData, blogId?: string): Promise<BlogsModelView> {
    const filter: any = createFilter(sortingData);
    const blogsLength = await BlogModel.countDocuments(filter); // make aggregation?
    const blogs = await this.blogsRepository.getBlogs(sortingData, filter);

    if (!blogs) {
      throw new CustomError(BlogErrors.NO_BLOGS);
    }

    return {
      pagesCount: Math.ceil(blogsLength / sortingData.pageSize),
      page: sortingData.pageNumber,
      pageSize: sortingData.pageSize,
      totalCount: blogsLength,
      items: blogs,
    };
  }

  async getBlogById(searchablePostId: string): Promise<BlogType> {
    const post = await this.blogsRepository.findBy(new Types.ObjectId(searchablePostId));

    if (!post) {
      throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID);
    }

    return post;
  }
}
