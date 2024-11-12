"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor({ message, field, status }) {
        super(message);
        this.status = status;
        this.field = field;
    }
}
exports.CustomError = CustomError;
