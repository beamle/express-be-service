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
exports.SessionErrors = void 0;
const settings_1 = require("../../app/settings");
const jwt_service_1 = __importDefault(require("../../authorization/services/jwt-service"));
const CustomError_1 = require("../../helpers/CustomError");
const Errors_1 = require("../users/meta/Errors");
const users_service_1 = __importDefault(require("../users/users.service"));
const session_repository_1 = require("./session.repository");
exports.SessionErrors = {
    NO_REFRESH_TOKEN: {
        message: 'No refresh token',
        field: 'refreshToken',
        status: 401,
    },
    INVALID_REFRESH_TOKEN: {
        message: 'Invalid refresh token',
        field: 'refreshToken',
        status: 401,
    },
    REFRESH_TOKEN_WAS_NOT_ADDED_TO_BLACKLIST: {
        message: "Refresh token wasn't added to blacklist",
        field: 'refreshToken',
        status: 401,
    },
    INVALID_OR_EXPIRED_REFRESH_TOKEN: {
        message: 'Invalid or expired refresh token',
        field: 'refreshToken',
        status: 401,
    },
    NO_SESSIONS_FOR_USER_ID: {
        message: 'No sessions for such userId was found!',
        field: 'id',
        status: 404,
    },
};
class SessionService {
    updateTokens(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkIfRefreshTokenIsNotBlacklisted(refreshToken);
            const { userId, deviceId } = yield jwt_service_1.default.parseAndValidateRefreshToken(refreshToken, settings_1.SETTINGS.JWT_SECRET);
            const result = yield session_repository_1.sessionRepository.addRefreshTokenToBlackList(refreshToken);
            if (!result.acknowledged) {
                throw new CustomError_1.CustomError(exports.SessionErrors.REFRESH_TOKEN_WAS_NOT_ADDED_TO_BLACKLIST);
            }
            const user = yield users_service_1.default.getUserBy({ id: userId });
            if (!user) {
                throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN);
            }
            const newAccessToken = yield jwt_service_1.default.createAccessToken(user);
            const { refreshToken: newRefreshToken } = yield jwt_service_1.default.createRefreshToken(user, deviceId);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw new CustomError_1.CustomError(exports.SessionErrors.INVALID_OR_EXPIRED_REFRESH_TOKEN);
            }
            const isInvalid = yield session_repository_1.sessionRepository.checkIfRefreshTokenInBlackList(refreshToken);
            if (isInvalid) {
                throw new CustomError_1.CustomError(exports.SessionErrors.INVALID_OR_EXPIRED_REFRESH_TOKEN);
            }
            yield jwt_service_1.default.parseAndValidateRefreshToken(refreshToken, settings_1.SETTINGS.JWT_SECRET);
            const result = yield session_repository_1.sessionRepository.addRefreshTokenToBlackList(refreshToken);
            if (!result.acknowledged) {
                throw new CustomError_1.CustomError(exports.SessionErrors.REFRESH_TOKEN_WAS_NOT_ADDED_TO_BLACKLIST);
            }
        });
    }
    checkIfRefreshTokenIsNotBlacklisted(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isInvalid = yield session_repository_1.sessionRepository.checkIfRefreshTokenInBlackList(refreshToken);
            if (isInvalid)
                throw new CustomError_1.CustomError(exports.SessionErrors.INVALID_OR_EXPIRED_REFRESH_TOKEN);
            return true;
        });
    }
    createSession(sessionMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield session_repository_1.sessionRepository.create(sessionMeta);
            return Object.assign({ id: result.insertedId.toString() }, sessionMeta);
        });
    }
    getAllSessionsBy(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield session_repository_1.sessionRepository.findAllSessionsByUser(userId);
            if (!result) {
                throw new CustomError_1.CustomError(exports.SessionErrors.NO_SESSIONS_FOR_USER_ID);
            }
            return result;
        });
    }
}
exports.default = new SessionService();
