import { db } from "../../app/db";

class TestingRepository {
  clearAllData() {
    db.blogs = []
    db.posts = []
  }
}

export default new TestingRepository()