import { blogsCollection, postsCollection } from "../../app/db";

class TestingRepository {
  async clearAllData() {
    await postsCollection.deleteMany({})
    await blogsCollection.deleteMany({})
  }
}

export default new TestingRepository()