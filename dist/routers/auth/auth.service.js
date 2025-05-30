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
const users_repository_1 = __importDefault(require("../users/users.repository"));
const mongodb_1 = require("mongodb");
const CustomError_1 = require("../../helpers/CustomError");
const Errors_1 = require("../users/meta/Errors");
const auth_controller_1 = require("./controller/auth.controller");
const users_service_1 = __importDefault(require("../users/users.service"));
const uuidv4_1 = require("uuidv4");
const jwt_service_1 = __importDefault(require("../../authorization/services/jwt-service"));
const email_manager_1 = __importStar(require("../../managers/email.manager"));
class AuthService {
    login(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.checkCredentials(loginOrEmail, password);
            if (!user)
                return null;
            const deviceId = (0, uuidv4_1.uuid)();
            const accessToken = yield jwt_service_1.default.createAccessToken(user);
            const { refreshToken } = yield jwt_service_1.default.createRefreshToken(user, deviceId);
            return { accessToken, refreshToken };
        });
    }
    // async registration(email: string, login:string, password: string) {
    //   await usersQueryRepository.getUserBy({ email })
    //   await usersQueryRepository.getUserBy({ login })
    //
    //   const createdUserId = await usersService.createUser({ email, password, login }, false)
    //   const user = await usersQueryRepository.getUserByEmail({ email }) as UserTypeViewModel
    //   // const user = await usersQueryRepository.getUserBy({ email: createdUserId.toString() }) as UserTypeViewModel
    //
    //   try {
    //     await emailManager.sendEmailConfirmationMessage(user, generateEmailConfirmationMessage(user.emailConfirmation.confirmationCode), "Registration confirmation") // fIXME: ne dolzno bytj tut manager, a service nuzhno ispolzovatj
    //   } catch (e) {
    //     handleErrorAsArrayOfErrors(res, e)
    //     await usersRepository.deleteUser(createdUserId)
    //   }
    // }
    registration(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, login } = dto;
            yield users_service_1.default.getUserBy({ email }); // rename to checkIf exist
            yield users_service_1.default.getUserBy({ login });
            const userId = yield users_service_1.default.createUser({ email, password, login }, false);
            const user = yield users_service_1.default.findUserBy({ email });
            try {
                yield email_manager_1.default.sendEmailConfirmationMessage(user, (0, email_manager_1.generateEmailConfirmationMessage)(user.emailConfirmation.confirmationCode), "Registration confirmation");
            }
            catch (e) {
                yield users_repository_1.default.deleteUser(userId);
                throw new CustomError_1.CustomError(auth_controller_1.AuthErrors.ACCOUNT_WAS_NOT_CREATED);
            }
            return user;
        });
    }
    confirmEmail(code, email) {
        return __awaiter(this, void 0, void 0, function* () {
            debugger;
            // findUserBy returns Null!
            let user = yield users_repository_1.default.findUserBy({ "emailConfirmation.confirmationCode": code });
            if (!user) {
                throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USER_WITH_SUCH_CODE_EXIST);
            }
            // && user.emailConfirmation.expirationDate > new Date()
            if (user.emailConfirmation.confirmationCode === code) {
                const result = yield users_repository_1.default.updateConfirmation(new mongodb_1.ObjectId(user._id));
                return result;
            }
            else {
                throw new CustomError_1.CustomError(auth_controller_1.AuthErrors.ACCOUNT_ALREADY_CONFIRMED);
            }
        });
    }
}
exports.default = new AuthService();
