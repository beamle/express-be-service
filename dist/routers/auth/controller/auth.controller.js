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
const users_service_1 = __importDefault(require("../../users/users.service"));
const validationHelpers_1 = require("../../../helpers/validationHelpers");
const jwt_service_1 = __importDefault(require("../../../authorization/services/jwt-service"));
const users_queryRepository_1 = __importDefault(require("../../users/users.queryRepository"));
const email_manager_1 = __importDefault(require("../../../managers/email.manager"));
const users_repository_1 = __importDefault(require("../../users/users.repository"));
const auth_service_1 = __importDefault(require("../auth.service"));
const uuidv4_1 = require("uuidv4");
const mongodb_1 = require("mongodb");
const CustomError_1 = require("../../../helpers/CustomError");
const session_repository_1 = require("../../session/session.repository");
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
        field: "code",
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
    // Todo:
    // 1. Otmetitj, starey refreshToken kak ne validnyj
    // 2. Sozdatj novyj REFRESH token i ACCESS token
    updateTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    return res.status(401).json({ message: 'No refresh token' });
                }
                const decoded = yield jwt_service_1.default.decodeToken(refreshToken);
                if (!decoded || !decoded.deviceId || !decoded.iat) {
                    return res.status(401).json({ message: 'Invalid refresh token' });
                }
                const { deviceId, iat, userId } = decoded;
                console.log(deviceId, iat);
                yield session_repository_1.sessionRepository.addRefreshTokenToBlackList(refreshToken);
                const user = yield users_queryRepository_1.default.getUserBy({ id: userId });
                if (!user) {
                    return res.status(401).json({ message: 'No user found with such Id attached to refreshToken' });
                }
                // WHY I USE UserModel in jwtService
                const newAccessToken = yield jwt_service_1.default.createAccessToken(user);
                const newRefreshToken = yield jwt_service_1.default.createRefreshToken(user, deviceId);
                // const session = await sessionsRepository.findSession(deviceId, iat);
                // if (!session) {
                //   return res.status(401).json({ message: 'Invalid or expired refresh token' });
                // }
                // const newAccessToken = await jwtService.createAccessJWT(session.userId);
                // const {
                //   refreshToken: newRefreshToken,
                //   iat: newIat,
                //   exp
                // } = await jwtService.createRefreshJWT(deviceId, session.userId);
                //
                // await sessionsRepository.updateSessionData({
                //   ...session,
                //   iat: newIat,
                //   exp
                // });
                res
                    .status(200);
                return;
                // .cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict' })
                // .json({ accessToken: newAccessToken });
            }
            catch (e) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        });
    }
    //
    // async updateTokens(req: Request, res: Response) {
    //   // GET refreshToken from cookie
    //   // Generate new tokens pair
    //   // Add previous refreshToken to blackList
    //   // Send back
    //   try {
    //     const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    //     if (user) {
    //       const { accessToken, refreshToken } = await jwtService.createJWT(user)
    //       res
    //         .status(200)
    //         .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
    //         .json({ accessToken });
    //       return
    //     }
    //   } catch (e) {
    //     handleError(res, e)
    //   }
    // }
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
                    yield email_manager_1.default.sendEmailConfirmationMessage(user, generateEmailConfirmationMessage(user.emailConfirmation.confirmationCode), "Registration confirmation"); // fIXME: ne dolzno bytj tut manager, a service nuzhno ispolzovatj
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
                    throw new CustomError_1.CustomError(exports.AuthErrors.EMAIL_ALREADY_CONFIRMED);
                }
                const newConfirmationCode = (0, uuidv4_1.uuid)();
                yield users_repository_1.default.updateUserConfirmationCode(new mongodb_1.ObjectId(user.id), newConfirmationCode);
                const updatedUser = yield users_queryRepository_1.default.getUserByEmail({ email });
                yield email_manager_1.default.sendEmailConfirmationMessage(updatedUser, generateEmailConfirmationMessage(updatedUser.emailConfirmation.confirmationCode), "Resending registration email"); // fIXME: ne dolzno bytj tut manager, a service nuzhno ispolzovatj
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
                    throw new CustomError_1.CustomError(exports.AuthErrors.ACCOUNT_ALREADY_CONFIRMED);
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
// utils
const generateEmailConfirmationMessage = (code) => {
    return "<h1>Thank you for your registration</h1>\n" +
        " <p>To finish registration please follow the link below:\n" +
        `     <a href=https://somesite.com/confirm-registration?code=${code}>complete registration</a>\n` +
        " </p>\n";
};
