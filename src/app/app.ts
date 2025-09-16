import express from "express";
import cors from "cors";
import { SETTINGS } from "./settings";
import { blogsRouter } from "../routers/blogs/blogs.router";
import { postsRouter } from "../routers/posts/posts.router";
import { testingRouter } from "../routers/testing/testing.router";
import { usersRouter } from "../routers/users/users.router";
import { authRouter } from "../routers/auth/auth.router";

import { Request, Response, NextFunction } from "express";
import { commentsRouter } from "../routers/comments/comments.router";
import cookieParser from "cookie-parser";

export function addContext(req: Request, res: Response, next: NextFunction) {
  req.context = { user: null };
  next();
}

export const app = express();
app.options("*", cors()); // Enable preflight for all rou
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // The request body will be available as a raw stream of data in req.body, but req.body will be undefined unless you manually parse it.
app.use(addContext);

app.get("/", (req, res) => {
  res.status(200).json({ version: "1.0" });
});

app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.USERS, usersRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);
