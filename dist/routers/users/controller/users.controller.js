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
const users_queryRepository_1 = __importDefault(require("../users.queryRepository"));
const objectGenerators_1 = require("../../../helpers/objectGenerators");
const validationHelpers_1 = require("../../../helpers/validationHelpers");
class UsersController {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortingData = (0, objectGenerators_1.generateSortingDataObject)(req);
            try {
                const users = yield users_queryRepository_1.default.getUsers(sortingData);
                res.status(200).json(users);
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(e, res);
            }
        });
    }
}
exports.default = new UsersController();
