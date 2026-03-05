import { Router } from "express";
import testingController from "./testing.controller";

export const testingRouter = Router();
testingRouter.delete("/all-data", testingController.clearDatabase)
testingRouter.get("/get-all-blacklisted-refresh-tokens", testingController.getAllBlackListedRefreshTokens)