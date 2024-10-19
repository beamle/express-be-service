export class BlogDto {
  name: string;
  description: string;
  websiteUrl: string;
  constructor(name, description, websiteUrl) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
  }
}