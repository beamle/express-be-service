"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomErrorWithArrayOfErrors = exports.CustomError = void 0;
class CustomError extends Error {
    constructor({ message, field, status }) {
        super(message);
        this.name = "CustomError";
        this.status = status;
        this.field = field;
    }
}
exports.CustomError = CustomError;
class CustomErrorWithArrayOfErrors extends Error {
    constructor({ message, field, status }) {
        super(message);
        this.name = "CustomError";
        this.status = status;
        this.field = field;
    }
}
exports.CustomErrorWithArrayOfErrors = CustomErrorWithArrayOfErrors;
