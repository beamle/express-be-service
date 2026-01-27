import { ObjectId } from 'mongodb';
import { blogsCollection, BlogsModelView, BlogsSortingData, BlogType } from '../../app/db';
import { CustomError } from '../../helpers/CustomError';
import { createFilter } from '../../helpers/objectGenerators';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostErrors } from '../posts/posts.service';
import { BlogErrors } from './blogs.service';

export class BlogsQueryRepository {
  private blogsRepository: BlogsRepository;

  constructor() {
    this.blogsRepository = new BlogsRepository();
  }
  async getBlogs(sortingData: BlogsSortingData, blogId?: string): Promise<BlogsModelView> {
    const filter: any = createFilter(sortingData);
    const blogsLength = await blogsCollection.countDocuments(filter); // make aggregation?
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
    const post = await this.blogsRepository.findBy(new ObjectId(searchablePostId));

    if (!post) {
      throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID);
    }

    return post;
  }
}
