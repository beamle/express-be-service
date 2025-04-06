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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
const CustomError_1 = require("../helpers/CustomError");
(0, dotenv_1.config)();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
class EmailAdapter {
    sendEmail(email, message, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`email`, email);
                console.log(`message`, message);
                console.log(`subject`, subject);
                const info = yield transporter.sendMail({
                    from: 'Nikita <nikitadevmode@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: subject, // Subject line
                    html: message, // html body
                });
                return info;
            }
            catch (e) {
                console.log('Error sending email: ', e);
                throw new CustomError_1.CustomError({
                    message: "Something went wrong with sending email",
                    field: "email STMP service",
                    status: 400
                });
            }
        });
    }
}
exports.default = new EmailAdapter();
