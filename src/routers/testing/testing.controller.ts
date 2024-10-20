import { db } from "../../app/db";
import testingRepository from "./testing.repository";

class TestingController {
  clearDatabase() {
    testingRepository.clearAllData()
  }
}
export default new TestingController()