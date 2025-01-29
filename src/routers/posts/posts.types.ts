import { PostType } from "../../app/db";

export type CreatePostInput = {
  title: string
  shortDescription: string
  content: string
  blogId: string
};

export type UpdatePostInput = CreatePostInput & { blogName: string}

export type CreatePostOutput = PostType | boolean
export type PostError = {
  message: string;
  field: string;
}

export type OutputErrorsType = {
  errorsMessages: PostError[]
}

export type CommentatorInfo = {
  userId: string
  userLogin: string
}

export type CommentViewModel = {
  id: string
  content: string
  commentatorInfo: CommentatorInfo
  createdAt: string
}