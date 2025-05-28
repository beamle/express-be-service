import testingRepository from "./testing.repository";
import { Request, Response } from "express";

class TestingController {
  async clearDatabase(req: Request, res: Response) {
    debugger
    await testingRepository.clearAllData()
    res.sendStatus(204)
  }
}
export default new TestingController()