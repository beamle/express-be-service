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
exports.accessTokenGuard = void 0;
const jwt_service_1 = __importDefault(require("../../authorization/services/jwt-service"));
const accessTokenGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!req.headers.authorization || !refreshToken) {
        return res.sendStatus(401); // Unauthorized
    }
    try {
        const payload = yield jwt_service_1.default.isTokenValid(refreshToken, "refresh token");
        // req.user = payload;
        return res.sendStatus(200);
        next();
    }
    catch (err) {
        return res.sendStatus(401);
    }
});
exports.accessTokenGuard = accessTokenGuard;
