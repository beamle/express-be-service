import { PostType } from "../../app/db";

export type CreatePostInput = {
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
};
export type CreatePostOutput = PostType
export type PostError = {
  message: string;
  field: string;
}

export type OutputErrorsType = {
  errorsMessages: PostError[]
}