"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_repository_1 = __importDefault(require("./testing.repository"));
class TestingController {
    clearDatabase() {
        testing_repository_1.default.clearAllData();
    }
}
exports.default = new TestingController();
