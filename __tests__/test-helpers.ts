import { app } from '../src/app/app'
import { agent } from 'supertest'
import { PostType } from "../src/app/db";
import { CreatePostInput } from "../src/routers/posts_/posts.types";
import { ObjectId } from "mongodb";

export const req = agent(app)

export const dummyBlogID1 = new ObjectId()
const dummyBlogID2 = new ObjectId()
const dummyBlogID3 = new ObjectId()

export const dummyBlogs = [
  { _id: dummyBlogID1, id: dummyBlogID1.toString(), name: "blogdummy1", description: "desct1", websiteUrl: "https://someurl.com", isMembership: false, createdAt: new Date().toISOString(), },
  {  _id: dummyBlogID2, id: dummyBlogID2.toString(), name: "blogdummy2", description: "desct2", websiteUrl: "https://someurl.com",  isMembership: false , createdAt: new Date().toISOString(),},
  {  _id: dummyBlogID3, id: dummyBlogID3.toString(), name: "blogdummy3", description: "desct3", websiteUrl: "https://someurl.com",  isMembership: false, createdAt: new Date().toISOString(), }
]

export const dummyPosts: PostType[] = [
  { _id: new ObjectId(),
    id: String(Math.random() * 0.2332),
    title: "dummy1",
    shortDescription: "desct1",
    content: "cshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescription",
    blogId: dummyBlogID1.toString(),
    blogName: "blogdummy1",
    createdAt: new Date().toISOString(),
  },
  {
    _id: new ObjectId(),
    id: String(Math.random() * 0.23333),
    title: "dummy2",
    shortDescription: "desct2",
    content: "cshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescription",
    blogId: dummyBlogID2.toString(),
    blogName: "blogdummy2",
    createdAt: new Date().toISOString(),
  },
  {
    _id: new ObjectId(),
    id: String(Math.random() * 0.23312),
    title: "dummy3",
    shortDescription: "desct3",
    content: "cshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescription",
    blogId: dummyBlogID3.toString(),
    blogName: "blogdummy3",
    createdAt: new Date().toISOString(),
  }
]

export const dummyPost1: PostType = {
  _id: new ObjectId(),
  id: String(Math.random() * 0.23312),
  title: "DUMMYPOST",
  shortDescription: "desct3testtesttesttesttesttest",
  content: "ajpsajsapsajppjapsapjtesttesttesttesttesttesttesttest",
  blogId: '1',
  blogName: "blogdummy1",
  createdAt: new Date().toISOString(),
}

export const dummyPostInput1: CreatePostInput = {
  title: "DUMMYPOS1",
  shortDescription: "desct1",
  content: "ajpsajsapsajppjapsapj1",
  blogId: dummyBlogID1.toString(),
}