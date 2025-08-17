import testingRepository from "./testing.repository";
import { Request, Response } from "express";

class TestingController {
  async clearDatabase(req: Request, res: Response) {
    await testingRepository.clearAllData()
    res.sendStatus(204)
  }
  async getAllBlackListedRefreshTokens(req: Request, res: Response) {
    debugger
    const result = await testingRepository.getAllBlackListedRefreshTokens();
    res.json(result);
  }

}
export default new TestingController()