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
exports.EmailManager = void 0;
const email_adapter_1 = __importDefault(require("../adapters/email.adapter"));
class EmailManager {
    sendEmailConfirmationMessage(user, message, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            yield email_adapter_1.default.sendEmail(user.email, message || "", subject);
        });
    }
}
exports.EmailManager = EmailManager;
exports.default = new EmailManager();
