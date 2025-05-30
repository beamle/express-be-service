"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const users_service_1 = __importDefault(require("../../users/users.service"));
const validationHelpers_1 = require("../../../helpers/validationHelpers");
const jwt_service_1 = __importDefault(require("../../../authorization/services/jwt-service"));
const users_queryRepository_1 = __importDefault(require("../../users/users.queryRepository"));
const email_manager_1 = __importStar(require("../../../managers/email.manager"));
const users_repository_1 = __importDefault(require("../../users/users.repository"));
const auth_service_1 = __importDefault(require("../auth.service"));
const uuidv4_1 = require("uuidv4");
const mongodb_1 = require("mongodb");
const session_service_1 = __importDefault(require("../../session/session.service"));
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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
};
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_service_1.default.checkCredentials(req.body.loginOrEmail, req.body.password);
                if (user) {
                    const deviceId = (0, uuidv4_1.uuid)();
                    const accessToken = yield jwt_service_1.default.createAccessToken(user);
                    const { refreshToken } = yield jwt_service_1.default.createRefreshToken(user, deviceId);
                    res
                        .status(200)
                        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                        // .header('Authorization', accessToken)
                        .json({ accessToken });
                    // res.status(200).json({ accessToken: accessToken })
                    return;
                }
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
                    // .header('Authorization', accessToken)
                    .json({ accessToken: accessToken });
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
                yield users_queryRepository_1.default.getUserBy({ email });
                yield users_queryRepository_1.default.getUserBy({ login });
                const createdUserId = yield users_service_1.default.createUser({ email, password, login }, false);
                const user = yield users_queryRepository_1.default.getUserByEmail({ email });
                // const user = await usersQueryRepository.getUserBy({ email: createdUserId.toString() }) as UserTypeViewModel
                try {
                    yield email_manager_1.default.sendEmailConfirmationMessage(user, (0, email_manager_1.generateEmailConfirmationMessage)(user.emailConfirmation.confirmationCode), "Registration confirmation"); // fIXME: ne dolzno bytj tut manager, a service nuzhno ispolzovatj
                }
                catch (e) {
                    (0, validationHelpers_1.handleErrorAsArrayOfErrors)(res, e);
                    yield users_repository_1.default.deleteUser(createdUserId);
                }
                res.status(204).json(user);
                return;
                // }
            }
            catch (e) {
                (0, validationHelpers_1.handleErrorAsArrayOfErrors)(res, e);
            }
        });
    }
    resendEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield users_queryRepository_1.default.getUserByEmail({ email });
                if (user.emailConfirmation.isConfirmed) {
                    res.status(401).json(exports.AuthErrors.EMAIL_ALREADY_CONFIRMED);
                    return;
                    // throw new CustomError(AuthErrors.EMAIL_ALREADY_CONFIRMED);
                }
                const newConfirmationCode = (0, uuidv4_1.uuid)();
                yield users_repository_1.default.updateUserConfirmationCode(new mongodb_1.ObjectId(user.id), newConfirmationCode);
                const updatedUser = yield users_queryRepository_1.default.getUserByEmail({ email });
                yield email_manager_1.default.sendEmailConfirmationMessage(updatedUser, (0, email_manager_1.generateEmailConfirmationResendMessage)(updatedUser.emailConfirmation.confirmationCode), "Registration confirmation"); // fIXME: ne dolzno bytj tut manager, a service nuzhno ispolzovatj
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
