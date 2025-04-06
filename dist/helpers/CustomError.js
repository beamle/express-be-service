"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor({ message, field, status }) {
        super(message);
        this.name = "CustomError";
        this.status = status;
        this.field = field;
    }
}
exports.CustomError = CustomError;
// export class CustomErrorWithArrayOfErrors extends Error {
//   status: number;
//   field: string;
//   name: string;
//
//   constructor({ message, field, status }: Array<{ message: string, status: number, field: string }>) {
//     super(message);
//     this.name = "CustomError";
//     this.status = status;
//     this.field = field;
//   }
// }
