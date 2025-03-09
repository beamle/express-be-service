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
                const createdUserId = yield users_service_1.default.createUser({ email, password, login });
                if (createdUserId) {
                    const user = yield users_queryRepository_1.default.getUserBy({ id: createdUserId.toString() });
                    res.status(201).json(user);
                    return;
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
