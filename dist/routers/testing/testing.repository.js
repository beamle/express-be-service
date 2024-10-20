"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../app/db");
class TestingRepository {
    clearAllData() {
        db_1.db.blogs = [];
        db_1.db.posts = [];
    }
}
exports.default = new TestingRepository();
