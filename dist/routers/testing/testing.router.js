"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const testing_controller_1 = __importDefault(require("./testing.controller"));
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete("/all-data", testing_controller_1.default.clearDatabase);
