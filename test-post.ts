import { Types } from 'mongoose';
import { runDb } from './src/app/db';
import container from './src/config/container';
import { PostsQueryRepository } from './src/features/posts/posts.queryRepository';
import { PostsService } from './src/features/posts/posts.service';
import { BlogsService } from './src/features/blogs/blogs.service';
import { UsersService } from './src/features/users/users.service';
import { UserModel } from './src/features/users/users.schema';
import { BlogModel } from './src/features/blogs/blogs.schema';
import { PostModel, PostLikeModel } from './src/features/posts/posts.schema';

async function testPostCreation() {
    await runDb();
    await UserModel.deleteMany({});
    await BlogModel.deleteMany({});
    await PostModel.deleteMany({});
    await PostLikeModel.deleteMany({});

    const blogsService = container.get(BlogsService);
    const postsService = container.get(PostsService);
    const postsQueryRepo = container.get(PostsQueryRepository);
    const usersService = container.get(UsersService);

    // Create user
    const userId = await usersService.createUser({
        login: "testuser",
        email: "test@test.com",
        password: "password123"
    });

    const user = await usersService.findUserBy({ id: userId.toString() });

    const blog: any = await blogsService.createBlog({
        name: 'Test Blog',
        description: 'Test Desc',
        websiteUrl: 'https://test.com'
    });

    const newPost = await postsService.createPost({
        title: 'Test Title',
        shortDescription: 'Test Desc',
        content: 'Test content',
        blogId: blog.id,
    });

    // Like the post
    await postsService.updateLikeStatus(new Types.ObjectId(newPost.id), String(user.id), user.login, 'Like');
    console.log('Liked Post by user:', user.login);

    // Fetch the post AS the user
    const mappedPost = await postsQueryRepo.getPostById(new Types.ObjectId(newPost.id), String(user.id));

    console.log('Mapped Post:', JSON.stringify(mappedPost, null, 2));

    process.exit();
}

testPostCreation().catch(console.error);
