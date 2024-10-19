export type BlogType = {
  id: string
  name: string
  description: string
  websiteUrl: string
}

export type PostType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
}

export type DBType = {
  blogs: Readonly<BlogType[]>
  posts: Readonly<PostType[]>
}

export const db: DBType = {
  blogs: [],
  posts: []
}