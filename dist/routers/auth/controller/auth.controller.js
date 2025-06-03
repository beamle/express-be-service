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
exports.AuthErrors = void 0;
const validationHelpers_1 = require("../../../helpers/validationHelpers");
const auth_service_1 = __importDefault(require("../auth.service"));
const session_service_1 = __importDefault(require("../../session/session.service"));
exports.AuthErrors = {
    EMAIL_CONFIRMATION_PROBLEM: {
        message: "Something wrong with email confirmation. Code is confirmed already or expirtationDate has expired",
        field: "code",
        status: 400
    },
    ACCOUNT_ALREADY_CONFIRMED: {
        message: "Your account is already confirmed",
        field: "code",
        status: 400
    },
    EMAIL_ALREADY_CONFIRMED: {
        message: "Your email is already confirmed",
        field: "email",
        status: 400
    },
    ACCOUNT_WAS_NOT_CREATED: {
        message: "Email sending failed. Registration rolled back.",
        field: "email",
        status: 400
    },
};
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken, refreshToken } = yield auth_service_1.default.login(req.body.loginOrEmail, req.body.password);
                res
                    .status(200)
                    .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                    .json({ accessToken });
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                yield session_service_1.default.logout(refreshToken);
                res.sendStatus(204);
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
    updateTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                const { accessToken, refreshToken: newRefreshToken } = yield session_service_1.default.updateTokens(refreshToken);
                res
                    .status(200)
                    .cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict' })
                    .json({ accessToken });
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleErrorAsArrayOfErrors)(res, e);
            }
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, login } = req.body;
            try {
                const user = yield auth_service_1.default.registration({ email, password, login });
                res.status(204).json(user);
            }
            catch (e) {
                (0, validationHelpers_1.handleErrorAsArrayOfErrors)(res, e);
            }
        });
    }
    resendEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield auth_service_1.default.resendEmail(req.body.email);
                res.sendStatus(204);
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleErrorAsArrayOfErrors)(res, e);
            }
        });
    }
    confirmEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield auth_service_1.default.confirmEmail(req.body.code, req.body.email);
                if (result) {
                    res.status(204).send();
                    return;
                }
                else {
                    res.status(401).json(exports.AuthErrors.EMAIL_ALREADY_CONFIRMED);
                    return;
                    // throw new CustomError(AuthErrors.ACCOUNT_ALREADY_CONFIRMED)
                }
            }
            catch (e) {
                (0, validationHelpers_1.handleErrorAsArrayOfErrors)(res, e);
            }
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json(req.context.user);
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
}
exports.default = new AuthController();
