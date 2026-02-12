import { JwtService } from '../authorization/services/jwt-service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/controller/auth.controller';
import { BlogsQueryRepository } from './blogs/blogs.queryRepository';
import { BlogsRepository } from './blogs/blogs.repository';
import { BlogsService } from './blogs/blogs.service';
import { BlogsController } from './blogs/controller/blogs.controller';
import { CommentsController } from './comments/comments.controller';
import { CommentsRepository } from './comments/comments.repository';
import { CommentsService } from './comments/comments.service';
import { PostsController } from './posts/controller/posts.controller';
import { PostsQueryRepository } from './posts/posts.queryRepository';
import { PostsRepository } from './posts/posts.repository';
import { PostsService } from './posts/posts.service';
import { SecurityController } from './security/security.controller';
import { SessionRepository } from './session/session.repository';
import { SessionService } from './session/session.service';
import { UsersController } from './users/controller/users.controller';
import { UsersQueryRepository } from './users/users.queryRepository';
import { UsersRepository } from './users/users.repository';
import { UsersService } from './users/users.service';

const jwtService = new JwtService();

const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository(usersRepository);
const usersService = new UsersService(usersQueryRepository, usersRepository);

const authService = new AuthService(usersService, jwtService, usersRepository);

const sessionRepository = new SessionRepository();
const sessionService = new SessionService(usersService, sessionRepository);

const blogsRepository = new BlogsRepository();
const blogsQueryRepository = new BlogsQueryRepository();
const blogsService = new BlogsService(blogsRepository);

const postsRepository = new PostsRepository(blogsRepository);
const postsQueryRepository = new PostsQueryRepository(postsRepository);
const postsService = new PostsService(postsRepository);

const commentsRepository = new CommentsRepository();
const commentsService = new CommentsService(commentsRepository);

export const authController = new AuthController(sessionService, authService);
export const usersController = new UsersController(usersService, usersQueryRepository);
export const blogsController = new BlogsController(blogsService, blogsQueryRepository);
export const postsController = new PostsController(blogsRepository, postsService, postsQueryRepository);
export const commentsController = new CommentsController(commentsService);
export const securityController = new SecurityController(sessionService);
