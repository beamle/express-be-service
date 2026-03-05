import { Collection, Db, MongoClient } from 'mongodb';
import { Types } from 'mongoose';
import { PasswordRecoveryType } from '../routers/auth/password-recovery.types';
import { app } from './app';
import { SETTINGS } from './settings';
import mongoose from 'mongoose';

const { CollectionMongoClient, ServerApiVersion } = require('mongodb');

export type BlogType = {
  _id?: Types.ObjectId;
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type PostType = {
  _id?: Types.ObjectId;
  id?: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type UserType = {
  _id?: Types.ObjectId;
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
  _id?: Types.ObjectId;
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
  _id?: Types.ObjectId;
  id?: any;
  refreshToken: string;
};

export type RefreshTokenDBType = {
  _id?: Types.ObjectId;
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

type WithId<T> = Omit<T, '_id'> & { id: string };

export type UserSession = WithId<UserSessionDBType>;

export type UserSessionDBType = {
  _id?: Types.ObjectId;
  userId: string;
  // deviceName: string;
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
  sortBy: 'createdAt' | string;
  sortDirection: 'asc' | 'desc';
};

export type PostsSortingData = SortingBase;
export type BlogsSortingData = SortingBase & Partial<{ searchNameTerm: string }>;
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

export let db: Db;

export async function runDb() {
  try {
    // Determine the URI, fallback to empty to let mongoose handle error if undefined
    const mongoUri = SETTINGS.MONGO_URI || (SETTINGS as any).MONGO_URL || "mongodb://localhost:27017";
    await mongoose.connect(mongoUri, { dbName: SETTINGS.DB_NAME as string });

    console.log('✅ Connected to MongoDB via Mongoose');

    // Fallback: assign the raw MongoDB db object
    db = mongoose.connection.db as unknown as Db;

    app.set('trust proxy', true);
  } catch (e) {
    console.error('❌ MongoDB connection error', e);
    await mongoose.disconnect();
  }
}
