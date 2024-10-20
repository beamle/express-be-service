import { app } from '../src/app/app'
import { agent } from 'supertest'
import { PostType } from "../src/app/db";
import { CreatePostInput } from "../src/routers/posts_/posts.types";

export const req = agent(app)

export const dummyBlogs = [
  { id: '1', name: "blogdummy1", description: "desct1", websiteUrl: "https://someurl.com" },
  { id: '2', name: "blogdummy2", description: "desct2", websiteUrl: "https://someurl.com" },
  { id: '3', name: "blogdummy3", description: "desct3", websiteUrl: "https://someurl.com" }
]

export const dummyPosts: PostType[] = [
  {
    id: String(Math.random() * 0.2332),
    title: "dummy1",
    shortDescription: "desct1",
    content: "cshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescription",
    blogId: '1',
    blogName: "blogdummy1"
  },
  {
    id: String(Math.random() * 0.23333),
    title: "dummy2",
    shortDescription: "desct2",
    content: "cshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescription",
    blogId: '2',
    blogName: "blogdummy2"
  },
  {
    id: String(Math.random() * 0.23312),
    title: "dummy3",
    shortDescription: "desct3",
    content: "cshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescription",
    blogId: '3',
    blogName: "blogdummy3"
  }
]

export const dummyPost1: PostType = {
  id: String(Math.random() * 0.23312),
  title: "DUMMYPOST",
  shortDescription: "desct3testtesttesttesttesttest",
  content: "ajpsajsapsajppjapsapjtesttesttesttesttesttesttesttest",
  blogId: '1',
  blogName: "blogdummy1"
}

export const dummyPostInput1: CreatePostInput = {
  title: "DUMMYPOST",
  shortDescription: "desct3",
  content: "ajpsajsapsajppjapsapj",
  blogId: '1',
}