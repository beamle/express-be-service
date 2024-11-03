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