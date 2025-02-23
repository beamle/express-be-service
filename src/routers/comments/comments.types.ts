import { CommentDBType } from "../../app/db";

export type CommentsModelView = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentType[];
}

export type CommentType = Omit<CommentDBType, "postId" | "_id">

export type Comment = {
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  id: string;
}