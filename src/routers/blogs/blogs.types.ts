export type CreateBlogInput = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type CreateBlogOutput = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
}
export type BlogError = {
  message: string;
  field: string;
}

export type OutputErrorsType = {
  errorsMessages: BlogError[]
}