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
const users_service_1 = __importDefault(require("../../users/users.service"));
const validationHelpers_1 = require("../../../helpers/validationHelpers");
const jwt_service_1 = __importDefault(require("../../../authorization/services/jwt-service"));
const users_queryRepository_1 = __importDefault(require("../../users/users.queryRepository"));
const email_manager_1 = __importDefault(require("../../../managers/email.manager"));
const users_repository_1 = __importDefault(require("../../users/users.repository"));
const auth_service_1 = __importDefault(require("../auth.service"));
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_service_1.default.checkCredentials(req.body.loginOrEmail, req.body.password);
                if (user) {
                    const token = yield jwt_service_1.default.createJWT(user);
                    res.status(200).json({ accessToken: token });
                    return;
                }
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, login } = req.body;
            try {
                yield users_queryRepository_1.default.getUserBy({ email });
                yield users_queryRepository_1.default.getUserBy({ login });
                const createdUserId = yield users_service_1.default.createUser({ email, password, login }, false);
                if (createdUserId) {
                    const user = yield users_queryRepository_1.default.getUserBy({ id: createdUserId.toString() });
                    try {
                        yield email_manager_1.default.sendEmailConfirmationMessage(user, generateEmailConfirmationMessage(user.emailConfirmation.confirmationCode));
                    }
                    catch (e) {
                        (0, validationHelpers_1.handleError)(res, e);
                        yield users_repository_1.default.deleteUser(createdUserId);
                    }
                    res.status(204).json(user);
                    return;
                }
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
    confirmEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield auth_service_1.default.confirmEmail(req.body.code, req.body.email);
                if (result) {
                    res.status(201).send();
                }
                else {
                    res.status(404).send();
                }
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            debugger;
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
        `     <a href=https://somesite.com/confirm-email?code=${code}>complete registration</a>\n` +
        " </p>\n";
};
