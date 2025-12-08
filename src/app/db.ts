import { Collection, MongoClient, ObjectId } from "mongodb";
import { SETTINGS } from "./settings";
import { app } from "./app";

const { CollectionMongoClient, ServerApiVersion } = require("mongodb");

export type BlogType = {
  _id?: ObjectId;
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type PostType = {
  _id?: ObjectId;
  id?: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type UserType = {
  _id?: ObjectId;
  id?: any; // TODO: remove id
  login: string;
  email: string;
  password: string;
  createdAt: string;
  emailConfirmation: {
    isConfirmed: boolean;
    confirmationCode: string;
    expirationDate: Date;
  };
};

export type UserCreationType = {
  email: string;
  password: string;
  login: string;
};

export type CommentDBType = {
  _id?: ObjectId;
  id?: any;
  postId?: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
};

export type SessionDBType = {
  _id?: ObjectId;
  id?: any;
  refreshToken: string;
};

export type RefreshTokenDBType = {
  _id?: ObjectId;
  id?: any;
  refreshToken: string;
};

// export type UserSessionDBType = {
//   _id?: string;
//   deviceId: string;
//   ip: string;
//   lastActiveDate: Date;
//   title: string;
// };


type WithId<T> = Omit<T, "_id"> & { id: string };

export type UserSession = WithId<UserSessionDBType>;

export type UserSessionDBType = {
  _id?: string
  userId: string;
  deviceName: string;
  deviceId: string;
  ip: string;
  lastActiveDate: Date;
  title: string;
  // iat: Date;
  // exp: Date;
};

export type RequestCasesMetadataDBType = {
  IP: string;
  baseURL: string;
  date: Date;
};

export type MeViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type UserTypeViewModel = {
  id: string;
  login: string;
  email: string;
  password?: string;
  createdAt: string;
  emailConfirmation: {
    isConfirmed: boolean;
    confirmationCode: string;
    expirationDate: Date;
  };
};

export type SortingBase = {
  pageNumber: number;
  pageSize: number;
  sortBy: "createdAt" | string;
  sortDirection: "asc" | "desc";
};

export type PostsSortingData = SortingBase;
export type BlogsSortingData = SortingBase &
  Partial<{ searchNameTerm: string }>;
export type UsersSortingData = SortingBase &
  Partial<{ searchLoginTerm: string }> &
  Partial<{
    searchEmailTerm: string;
  }>;
export type CommentsSortingData = SortingBase;

export type BlogsModelView = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogType[];
};

export let blogsCollection: Collection<BlogType>;
export let postsCollection: Collection<PostType>;
export let usersCollection: Collection<UserType>;
export let commentsCollection: Collection<CommentDBType>;
export let sessionsCollection: Collection<UserSessionDBType>;
// export let sessionsMetadataCollection: Collection<UserSessionMetadataDBType>;
export let requestCasesMetadataCollection: Collection<RequestCasesMetadataDBType>;
export let refreshTokenBlacklistCollection: Collection<RefreshTokenDBType>;
// export let sessionsCollection: Collection<UserSessionDBType>;

export async function runDb(url: string) {
  const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    const db = client.db(SETTINGS.DB_NAME as string);
    await db.command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    postsCollection = db.collection<PostType>(SETTINGS.PATH.POSTS);
    blogsCollection = db.collection<BlogType>(SETTINGS.PATH.BLOGS);
    usersCollection = db.collection<UserType>(SETTINGS.PATH.USERS);
    commentsCollection = db.collection<CommentDBType>(SETTINGS.PATH.COMMENTS);
    requestCasesMetadataCollection = db.collection<RequestCasesMetadataDBType>(
      SETTINGS.PATH.REQUEST_CASES
    );
    refreshTokenBlacklistCollection = db.collection<RefreshTokenDBType>(
      SETTINGS.PATH.REFRESH_TOKEN_BLACKLIST
    );
    sessionsCollection = db.collection<UserSessionDBType>(
      SETTINGS.PATH.SESSION
    );
    // sessionsMetadataCollection = db.collection<UserSessionMetadataDBType>(
    //   SETTINGS.PATH.SESSION_META
    // );

    console.log("Connected to collections!");

    app.set('trust proxy', true)
  } catch (e) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
