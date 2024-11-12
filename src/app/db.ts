import { Collection, MongoClient, ObjectId } from "mongodb";
import { SETTINGS } from "./settings";

const { CollectionMongoClient, ServerApiVersion } = require('mongodb');

export type BlogType = {
  _id?: ObjectId
  id?: string
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}

export type PostType = {
  _id?: ObjectId
  id?: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}

export type UserType = {
  _id?: ObjectId
  id: string,
  login: string,
  email: string,
  createdAt: string
}

export type SortingDataBase = {
  pageNumber: number
  pageSize: number
  sortBy: 'createdAt' | string
  sortDirection: 'asc' | 'desc'
}

export type PostsSortingData = SortingDataBase
export type BlogsSortingData = SortingDataBase & Partial<{ searchNameTerm: string | null }>
export type UsersSortingData = SortingDataBase & Partial<{ searchLoginTerm: string | null }> & Partial<{ searchEmailTerm: string | null }>

export type BlogsModelView =  {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogType[] }

export let blogsCollection: Collection<BlogType>
export let postsCollection: Collection<PostType>
export let usersCollection: Collection<UserType>


export async function runDb(url: string) {
  const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    const db = client.db(SETTINGS.DB_NAME as string)
    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    postsCollection = db.collection<PostType>(SETTINGS.PATH.POSTS)
    blogsCollection = db.collection<BlogType>(SETTINGS.PATH.BLOGS)
    usersCollection = db.collection<UserType>(SETTINGS.PATH.USERS)

    console.log("Conntected to collections!")
  } catch (e) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}