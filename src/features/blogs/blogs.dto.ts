export class BlogDto {
  name: string;
  description: string;
  websiteUrl: string;
  constructor(name: string, description: string, websiteUrl: string) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
  }
}

// export class UpdateBlogDto {
//   id: string
//   name?: string;
//   description?: string;
//   websiteUrl?: string;
//   constructor(name: string, description: string, websiteUrl: string, id: string) {
//     this.id =  id;
//     this.name = name;
//     this.description = description;
//     this.websiteUrl = websiteUrl;
//   }
// }