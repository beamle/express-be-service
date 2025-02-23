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
exports.bearerAuthorizationValidator = bearerAuthorizationValidator;
const jwt_service_1 = __importDefault(require("../services/jwt-service"));
const auth_queryRepository_1 = __importDefault(require("../../routers/auth/auth.queryRepository"));
const validationHelpers_1 = require("../../helpers/validationHelpers");
function bearerAuthorizationValidator(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = req.headers["authorization"];
        if (!auth) {
            res.status(404).json({ message: "No authorization header" });
            return;
        }
        if (!auth.startsWith("Bearer")) {
            res.status(401).json({ message: "Invalid authorization type" });
            return;
        }
        const token = req.headers.authorization.split(' ')[1];
        try {
            debugger;
            const userId = yield jwt_service_1.default.getUserIdByToken(token);
            if (userId) {
                const user = yield auth_queryRepository_1.default.getMeBy(userId);
                req.context.user = user;
                next();
            }
        }
        catch (e) {
            (0, validationHelpers_1.handleError)(res, e);
        }
        // res.sendStatus(401)
    });
}
