import 'reflect-metadata';
import { Container } from 'inversify';
import { JwtService } from '../authorization/services/jwt-service';
import { AuthService } from '../features/auth/auth.service';
import { AuthController } from '../features/auth/auth.controller';
import { BlogsQueryRepository } from '../features/blogs/blogs.queryRepository';
import { BlogsRepository } from '../features/blogs/blogs.repository';
import { BlogsService } from '../features/blogs/blogs.service';
import { BlogsController } from '../features/blogs/blogs.controller';
import { CommentsController } from '../features/comments/comments.controller';
import { CommentsRepository } from '../features/comments/comments.repository';
import { CommentsService } from '../features/comments/comments.service';
import { PostsController } from '../features/posts/posts.controller';
import { PostsQueryRepository } from '../features/posts/posts.queryRepository';
import { PostsRepository } from '../features/posts/posts.repository';
import { PostsService } from '../features/posts/posts.service';
import { SecurityController } from '../features/security/security.controller';
import { SessionRepository } from '../features/session/session.repository';
import { SessionService } from '../features/session/session.service';
import { UsersController } from '../features/users/users.controller';
import { UsersQueryRepository } from '../features/users/users.queryRepository';
import { UsersRepository } from '../features/users/users.repository';
import { UsersService } from '../features/users/users.service';

import { AuthQueryRepository } from '../features/auth/auth.queryRepository';
import { CommentsQueryRepository } from '../features/comments/comments.queryRepository';

// const jwtService = new JwtService();

// const usersRepository = new UsersRepository();
// const usersQueryRepository = new UsersQueryRepository(usersRepository);
// const usersService = new UsersService(usersQueryRepository, usersRepository);

// const authService = new AuthService(usersService, jwtService, usersRepository);

// const sessionRepository = new SessionRepository();
// const sessionService = new SessionService(usersService, sessionRepository);

// const blogsRepository = new BlogsRepository();
// const blogsQueryRepository = new BlogsQueryRepository();
// const blogsService = new BlogsService(blogsRepository);

// const postsRepository = new PostsRepository(blogsRepository);
// const postsQueryRepository = new PostsQueryRepository(postsRepository);
// const postsService = new PostsService(postsRepository);

// const commentsRepository = new CommentsRepository();
// const commentsService = new CommentsService(commentsRepository);

// export const authController = new AuthController(sessionService, authService);
// export const usersController = new UsersController(usersService, usersQueryRepository);
// export const blogsController = new BlogsController(blogsService, blogsQueryRepository);
// export const postsController = new PostsController(blogsRepository, postsService, postsQueryRepository);
// export const commentsController = new CommentsController(commentsService);
// export const securityController = new SecurityController(sessionService);

export const container = new Container();

container.bind<AuthController>(AuthController).to(AuthController);
container.bind<AuthService>(AuthService).to(AuthService);
container.bind<AuthQueryRepository>(AuthQueryRepository).to(AuthQueryRepository);
container.bind<JwtService>(JwtService).to(JwtService);
container.bind<UsersController>(UsersController).to(UsersController);
container.bind<UsersService>(UsersService).to(UsersService);
container.bind<UsersQueryRepository>(UsersQueryRepository).to(UsersQueryRepository);
container.bind<UsersRepository>(UsersRepository).to(UsersRepository);
container.bind<BlogsController>(BlogsController).to(BlogsController);
container.bind<BlogsService>(BlogsService).to(BlogsService);
container.bind<BlogsQueryRepository>(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository);
container.bind<PostsController>(PostsController).to(PostsController);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<PostsQueryRepository>(PostsQueryRepository).to(PostsQueryRepository);
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);
container.bind<CommentsController>(CommentsController).to(CommentsController);
container.bind<CommentsService>(CommentsService).to(CommentsService);
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository);
container.bind<SessionService>(SessionService).to(SessionService);
container.bind<SessionRepository>(SessionRepository).to(SessionRepository);
container.bind<SecurityController>(SecurityController).to(SecurityController);

container.bind<CommentsQueryRepository>(CommentsQueryRepository).to(CommentsQueryRepository);

export default container;
