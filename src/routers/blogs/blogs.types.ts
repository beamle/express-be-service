import { BlogType } from "../../app/db";

export type CreateBlogInput = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type CreateBlogOutput = BlogType | boolean
export type BlogError = {
  message: string;
  field: string;
}

export type OutputErrorsType = {
  errorsMessages: BlogError[]
}