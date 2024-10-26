import { Router } from "express";
import testingController from "./testing.controller";

export const testingRouter = Router();
// TODO: remove all-data
testingRouter.delete("/all-data", testingController.clearDatabase)