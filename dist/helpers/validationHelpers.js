"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputCheckErrorsFormatter = void 0;
const express_validator_1 = require("express-validator");
const inputCheckErrorsFormatter = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    debugger;
    if (errors.length > 0) {
        const formattedErrors = errors.map((err) => {
            console.log(errors, "ERRORS");
            return {
                message: err.msg,
                field: err.path
            };
        });
        return res.status(400).json({ errorsMessages: formattedErrors });
    }
    next();
};
exports.inputCheckErrorsFormatter = inputCheckErrorsFormatter;
