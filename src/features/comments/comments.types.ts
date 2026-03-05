import { CommentDBType } from "../../app/db";

export type CommentsModelView = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentType[];
}

export type CommentType = CommentDBType

export type Comment = {
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  id: string;
  _id?: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  }
}

export type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}