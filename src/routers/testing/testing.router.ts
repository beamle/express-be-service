import { Router } from "express";
import testingController from "./testing.controller";

export const testingRouter = Router();
debugger
testingRouter.delete("/all-data", testingController.clearDatabase)