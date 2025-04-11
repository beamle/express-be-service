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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../../app/settings");
const CustomError_1 = require("../../helpers/CustomError");
const JwtServiceErrors = {
    NO_CORRECT_TOKEN_PROVIDED: { message: "Unauthorized. You have to pass correct jwt token", field: "", status: 401 },
    NO_TOKEN_PROVIDED: { message: "Unauthorized. You didn't pass jwt token", field: "", status: 404 },
};
class jwtService {
    createJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, settings_1.SETTINGS.JWT_SECRET, { expiresIn: '10h' });
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, settings_1.SETTINGS.JWT_SECRET, { expiresIn: '1d' });
            return { accessToken, refreshToken };
        });
    }
    isTokenValid(token, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                jsonwebtoken_1.default.verify(token, key);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token || token === "undefined") {
                throw new CustomError_1.CustomError(JwtServiceErrors.NO_TOKEN_PROVIDED);
            }
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.SETTINGS.JWT_SECRET);
                return result.userId;
            }
            catch (e) {
                throw new CustomError_1.CustomError(JwtServiceErrors.NO_CORRECT_TOKEN_PROVIDED);
            }
        });
    }
}
exports.default = new jwtService();
