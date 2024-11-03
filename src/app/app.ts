import express from 'express'
import cors from 'cors'
import { SETTINGS } from "./settings";
import { blogsRouter } from "../routers/blogs/blogs.router";
import { postsRouter } from "../routers/posts_/posts.router";
import { testingRouter } from "../routers/testing/testing.router";

export const app = express()
app.options('*', cors()); // Enable preflight for all rou
app.use(cors())
app.use(express.json()) // The request body will be available as a raw stream of data in req.body, but req.body will be undefined unless you manually parse it.

app.get('/', (req, res) => {
  res.status(200).json({version: '1.0'})

})
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter )