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
const validationHelpers_1 = require("../../helpers/validationHelpers");
const session_service_1 = __importDefault(require("./session.service"));
class SessionController {
    getAllSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessions = yield session_service_1.default.getAllSessionsBy(userId);
                res.status(200).json(sessions);
                return;
            }
            catch (error) {
                (0, validationHelpers_1.handleError)(res, error);
            }
        });
    }
}
exports.default = new SessionController();
