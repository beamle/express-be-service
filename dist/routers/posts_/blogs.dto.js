"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsDto = void 0;
class PostsDto {
    constructor(name, description, websiteUrl) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
    }
}
exports.PostsDto = PostsDto;
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
