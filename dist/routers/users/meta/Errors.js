"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersErrors = void 0;
exports.UsersErrors = {
    NO_USERS: { message: "Something went wrong, try again.", field: "", status: 404 },
    USER_NOT_CREATED: { message: "User was not created!", field: "", status: 404 },
    NO_USER_WITH_SUCH_ID: { message: "User with such id was not found!", field: "id", status: 404 },
    NO_USER_WITH_SUCH_EMAIL_OR_LOGIN: { message: "User with such email or login was not found!", field: "loginOrEmail", status: 401 },
    NO_USER_WITH_SUCH_EMAIL: { message: "User with such email was not found!", field: "email", status: 400 },
    NO_USER_WITH_SUCH_CODE_EXIST: { message: "User with such confirmation code does not exist!", field: "code", status: 400 },
    INCORRECT_PASSWORD: { message: "Wrong password", field: "password", status: 401 },
    INTERNAL_SERVER_ERROR: { message: "Internal server error", field: "", status: 500 },
    USER_WITH_SUCH_EMAIL_ALREADY_EXIST: { message: "Such email already in use", field: "email", status: 400 },
    USER_WITH_SUCH_LOGIN_ALREADY_EXIST: { message: "Such login already in use", field: "login", status: 400 }
};
