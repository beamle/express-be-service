"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputCheckErrorsFormatter = void 0;
exports.handleError = handleError;
const express_validator_1 = require("express-validator");
const inputCheckErrorsFormatter = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
        const formattedErrors = errors.map((err) => {
            console.log(errors, "ERRORS");
            return {
                message: err.msg,
                field: err.path
            };
        });
        // TODO: SPROSITJ KAK PRAVILJNO OBrabatyvatj v formatter raznye case oshibok
        // if (req.method === "DELETE" && formattedErrors.some(error => error.field === "id")) {
        //   return res.status(404).json({ errorsMessages: formattedErrors });
        // }
        //
        // if (req.method === "GET" && formattedErrors.some(error => error.field === "blogId")) {
        //   return res.status(404).json({ errorsMessages: formattedErrors });
        // }
        //
        // if (req.method === "POST" && formattedErrors.some(error => error.field === "blogId")) {
        //   return res.status(404).json({ errorsMessages: formattedErrors });
        // }
        return res.status(400).json({ errorsMessages: formattedErrors });
    }
    next();
};
exports.inputCheckErrorsFormatter = inputCheckErrorsFormatter;
function handleError(res, error) {
    if (error.name === 'CustomError') {
        res.status(error.status).json({ message: error.message, field: error.field });
        return;
    }
    else {
        // res.status(500).json(PostErrors.INTERNAL_SERVER_ERROR);
        res.status(500).json({ message: "Internal server error", field: "", status: 500 });
        console.log(res, "RES");
        return;
    }
}
