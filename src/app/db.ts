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
  id?: any, // TODO: remove id
  login: string,
  email: string,
  password: string,
  createdAt: string
  // emailConfirmation: {
  //   isConfirmed: boolean
  //   confirmationCode: string
  //   expirationDate: Date
  // }

}

export type CommentDBType = {
  _id?: ObjectId
  id?: any
  postId: string
  content: string
  commentatorInfo: {
    userId: string
    userLogin: string
  },
  createdAt: string
}

export type MeViewModel = {
  email: string
  login: string
  userId: string
}

// export type UserCreationInput = {
//   _id?: ObjectId
//   id?: any
//   login: string,
//   email: string,
//   password: string,
// }

export type UserTypeViewModel = {
  id: string,
  login: string,
  email: string,
  password?: string,
  createdAt: Date
  emailConfirmation: {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
  }
}

export type SortingBase = {
  pageNumber: number
  pageSize: number
  sortBy: 'createdAt' | string
  sortDirection: 'asc' | 'desc'
}

export type PostsSortingData = SortingBase
export type BlogsSortingData = SortingBase & Partial<{ searchNameTerm: string }>
export type UsersSortingData = SortingBase & Partial<{ searchLoginTerm: string }> & Partial<{
  searchEmailTerm: string
}>
export type CommentsSortingData = SortingBase

export type BlogsModelView = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogType[]
}

export let blogsCollection: Collection<BlogType>
export let postsCollection: Collection<PostType>
export let usersCollection: Collection<UserType>
export let commentsCollection: Collection<CommentDBType>


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
    commentsCollection = db.collection<CommentDBType>(SETTINGS.PATH.COMMENTS)

    console.log("Conntected to collections!")
  } catch (e) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}