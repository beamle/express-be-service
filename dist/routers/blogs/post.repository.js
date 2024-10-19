"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRepository = void 0;
exports.blogRepository = {
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = Object.assign(Object.assign({}, input), { id: Date.now() + Math.random() });
            try {
                db.posts = [...db.posts, newPost];
            }
            catch (e) {
                // log
                return { error: e.message };
            }
            return { id: newPost.id };
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db.posts.find(p => p.id === id);
        });
    },
    findForOutput(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.find(id);
            if (!post) {
                return null;
            }
            return this.mapToOutput(post);
        });
    },
    mapToOutput(post) {
        return {
            id: post.id,
            title: post.title,
        };
    }
};
