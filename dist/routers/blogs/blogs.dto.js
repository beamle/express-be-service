"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogDto = void 0;
class BlogDto {
    constructor(name, description, websiteUrl) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
    }
}
exports.BlogDto = BlogDto;
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
