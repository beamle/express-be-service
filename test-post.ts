import { Types } from 'mongoose';
import { runDb } from './src/app/db';
import container from './src/config/container';
import { PostsQueryRepository } from './src/features/posts/posts.queryRepository';
import { PostsService } from './src/features/posts/posts.service';
import { BlogsService } from './src/features/blogs/blogs.service';

async function testPostCreation() {
    await runDb();
    const blogsService = container.get(BlogsService);
    const postsService = container.get(PostsService);
    const postsQueryRepo = container.get(PostsQueryRepository);

    const blog: any = await blogsService.createBlog({
        name: 'Test Blog',
        description: 'Test Desc',
        websiteUrl: 'https://test.com'
    });

    console.log('Created Blog:', blog);

    const newPost = await postsService.createPost({
        title: 'Test Title',
        shortDescription: 'Test Desc',
        content: 'Test content',
        blogId: blog.id,
    });

    console.log('Created Post ID:', newPost.id);

    const mappedPost = await postsQueryRepo.getPostById(new Types.ObjectId(newPost.id));

    console.log('Mapped Post:', JSON.stringify(mappedPost, null, 2));

    process.exit();
}

testPostCreation().catch(console.error);
