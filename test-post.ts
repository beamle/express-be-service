import { Types } from 'mongoose';
import { runDb } from './src/app/db';
import container from './src/config/container';
import { PostsQueryRepository } from './src/features/posts/posts.queryRepository';
import { PostsService } from './src/features/posts/posts.service';

async function testPostCreation() {
    await runDb();
    const postsService = container.get(PostsService);
    const postsQueryRepo = container.get(PostsQueryRepository);

    const newPost = await postsService.createPost({
        title: 'Test Title',
        shortDescription: 'Test Desc',
        content: 'Test content',
        blogId: new Types.ObjectId().toString(),
    });

    console.log('Created Post ID:', newPost.id);

    const mappedPost = await postsQueryRepo.getPostById(new Types.ObjectId(newPost.id));

    console.log('Mapped Post:', JSON.stringify(mappedPost, null, 2));

    process.exit();
}

testPostCreation().catch(console.error);
