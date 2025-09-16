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
exports.RequestCasesMetadataController = void 0;
const request_cases_repository_1 = __importDefault(require("./request-cases.repository"));
const validationHelpers_1 = require("../../helpers/validationHelpers");
class RequestCasesMetadataController {
    saveRequestMetadata(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { IP, baseURL, date } = req;
            console.log(IP, baseURL, date);
            try {
                const requestMeta = yield request_cases_repository_1.default.create({
                    IP,
                    baseURL,
                    date,
                });
                res.status(200).json();
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
}
exports.RequestCasesMetadataController = RequestCasesMetadataController;
