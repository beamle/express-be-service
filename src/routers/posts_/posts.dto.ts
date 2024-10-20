export class PostsDto {
  title: string
  shortDescription: string
  content: string
  blogName: string

  constructor(title: string,
              shortDescription: string,
              content: string,
              blogName: string) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogName = blogName;
  }
}
