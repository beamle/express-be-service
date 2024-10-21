import { db } from "../../app/db";

class TestingRepository {
  async clearAllData() {
    db.blogs = []
    db.posts = []
  }
}

export default new TestingRepository()