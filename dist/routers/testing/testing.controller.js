"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_repository_1 = __importDefault(require("./testing.repository"));
class TestingController {
    clearDatabase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield testing_repository_1.default.clearAllData();
            res.sendStatus(204);
        });
    }
    getAllBlackListedRefreshTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            debugger;
            const result = yield testing_repository_1.default.getAllBlackListedRefreshTokens();
            res.json(result);
        });
    }
}
exports.default = new TestingController();
