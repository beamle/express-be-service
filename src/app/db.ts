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

export type PostsSortingData = {
  pageNumber: number
  pageSize: number
  sortBy: 'createdAt' | string
  sortDirection: 'asc' | 'desc'
}
export type BlogsSortingData = PostsSortingData & Partial<{ searchNameTerm: string | null }>

export let blogsCollection: Collection<BlogType>
export let postsCollection: Collection<PostType>


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
    console.log("Conntected to collections!")
  } catch (e) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}