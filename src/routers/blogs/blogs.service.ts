import { ObjectId } from 'mongodb';
import { BlogType } from '../../app/db';
import { CustomError } from '../../helpers/CustomError';
import { BlogsRepository } from './blogs.repository';
import { CreateBlogInput } from './blogs.types';

export const BlogErrors = {
  NO_BLOGS: { message: 'Something went wrong, try again.', field: '', status: 404 },
  NO_BLOG_WITH_SUCH_ID: { message: 'No blog with such id has been found!', field: 'id', status: 404 },
  BLOG_NOT_CREATED: { message: 'Blog was not created!', field: '', status: 400 },
  INTERNAL_SERVER_ERROR: { message: 'Internal server error', field: '', status: 500 },
};

export class BlogsService {
  private blogsRepository: BlogsRepository;

  constructor() {
    this.blogsRepository = new BlogsRepository();
  }
  async createBlog(blogCreatingInput: CreateBlogInput): Promise<BlogType> {
    const createdBlogId = await this.blogsRepository.create(blogCreatingInput); // TODO: vsju logiku po sozdaniju vynesti sjuda

    if (!(createdBlogId instanceof ObjectId)) {
      throw new CustomError(BlogErrors.NO_BLOG_WITH_SUCH_ID);
    }

    const createdBlog = await this.blogsRepository.findBy(createdBlogId);

    if (!createdBlog) {
      throw new CustomError(BlogErrors.BLOG_NOT_CREATED);
    }

    return createdBlog;
  }

  async updateBlog(dataForUpdate: CreateBlogInput, blogId: ObjectId): Promise<boolean | number> {
    const updatedBlog = await this.blogsRepository.updateBlog(dataForUpdate, blogId);

    if (!updatedBlog) {
      throw new CustomError(BlogErrors.NO_BLOG_WITH_SUCH_ID);
    }

    return updatedBlog;
  }

  async deleteBlog(blogId: ObjectId): Promise<boolean> {
    const blog = await this.blogsRepository.delete(blogId);

    if (!blog) {
      throw new CustomError(BlogErrors.NO_BLOG_WITH_SUCH_ID);
    }

    return blog;
  }
}
