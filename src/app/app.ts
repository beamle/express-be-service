import express from 'express'
import cors from 'cors'
import { SETTINGS } from "./settings";
import { blogsRouter } from "../routers/blogs/blogs.router";

export const app = express()
app.use(express.json()) // The request body will be available as a raw stream of data in req.body, but req.body will be undefined unless you manually parse it.
app.use(cors()) // Allow request from all origins

app.get('/', (req, res) => {
  res.status(200).json({version: '1.0'})
})
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
// app.use(SETTINGS.PATH.POSTS, postsRouter)