import cors from 'cors';
import express from 'express';
import { authRouter } from '../features/auth/auth.router';
import { blogsRouter } from '../features/blogs/blogs.router';
import { postsRouter } from '../features/posts/posts.router';
import { testingRouter } from '../features/testing/testing.router';
import { usersRouter } from '../features/users/users.router';
import { SETTINGS } from './settings';

import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import { commentsRouter } from '../features/comments/comments.router';
import { securityRouter } from '../features/security/security.router';

export function addContext(req: Request, res: Response, next: NextFunction) {
  req.context = { user: null };
  next();
}
debugger;
export const app = express();
app.options('*', cors()); // Enable preflight for all rou
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // The request body will be available as a raw stream of data in req.body, but req.body will be undefined unless you manually parse it.
app.use(addContext);

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' });
});

app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.USERS, usersRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
app.use(SETTINGS.PATH.SECURITY, securityRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);
